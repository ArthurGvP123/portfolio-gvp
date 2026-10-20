"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ProjectItem } from "@/types/portfolio";
import { calculateFibonacciSpherePoints } from "@/utils/math3d";
import { playHapticClick } from "@/utils/audio";

export interface SphericalCoordinates {
  lat: number;
  lon: number;
  phi: number;
  theta: number;
}

export interface UseThreeSphereOptions {
  projects: ProjectItem[];
  radius?: number;
  onHoverProject?: (project: ProjectItem | null, screenCoord?: { x: number; y: number }) => void;
  onSelectProject?: (project: ProjectItem) => void;
}

export interface UseThreeSphereReturn {
  containerRef: React.RefObject<HTMLDivElement | null>;
  activeProject: ProjectItem | null;
  coords: SphericalCoordinates;
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
  isDragging: boolean;
}

/**
 * Deterministic GPU memory deallocation routine for Three.js.
 * Recursively disposes all geometries, materials, and textures,
 * forces WebGL context loss, and unlinks canvas DOM element.
 * Guarantees zero memory leaks and eliminates WebGL: CONTEXT_LOST crashes.
 */
export function disposeThreeScene(
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  animationFrameId?: number
): void {
  if (
    animationFrameId !== undefined &&
    animationFrameId !== 0 &&
    typeof cancelAnimationFrame !== "undefined"
  ) {
    cancelAnimationFrame(animationFrameId);
  }

  scene.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      if (object.geometry) {
        object.geometry.dispose();
      }
      if (object.material) {
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        for (const mat of materials) {
          // Dispose all texture properties
          for (const key of Object.keys(mat)) {
            const val = (mat as unknown as Record<string, unknown>)[key];
            if (
              val &&
              typeof val === "object" &&
              "dispose" in val &&
              typeof (val as { dispose: () => void }).dispose === "function"
            ) {
              (val as { dispose: () => void }).dispose();
            }
          }
          mat.dispose();
        }
      }
    } else if (object instanceof THREE.Line || object instanceof THREE.LineSegments) {
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((m) => m.dispose());
        } else {
          object.material.dispose();
        }
      }
    }
  });

  try {
    renderer.dispose();
    renderer.forceContextLoss();
    const gl = renderer.getContext();
    if (gl && "getExtension" in gl) {
      const loseExt = gl.getExtension("WEBGL_lose_context");
      if (loseExt) {
        loseExt.loseContext();
      }
    }
  } catch {
    // Context already lost or unavailable
  }

  if (renderer.domElement && renderer.domElement.parentNode) {
    renderer.domElement.parentNode.removeChild(renderer.domElement);
  }
}

/**
 * Procedural Swiss-brutalist canvas texture generator for project cards on 3D sphere.
 * Produces crisp, high-contrast textures rendered synchronously to CanvasTexture.
 */
function createProjectCardTexture(project: ProjectItem): THREE.CanvasTexture {
  const width = 512;
  const height = 340;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  // Base background fill
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, "#0e0e11");
  bgGrad.addColorStop(1, "#16171b");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle grid lines
  ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
  ctx.lineWidth = 1;
  for (let x = 32; x < width; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 32; y < height; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Double Hairline Border
  ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
  ctx.lineWidth = 2;
  ctx.strokeRect(12, 12, width - 24, height - 24);

  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 1;
  ctx.strokeRect(18, 18, width - 36, height - 36);

  // Corner crosshairs
  ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
  ctx.lineWidth = 1.5;
  const cross = (cx: number, cy: number) => {
    ctx.beginPath();
    ctx.moveTo(cx - 6, cy);
    ctx.lineTo(cx + 6, cy);
    ctx.moveTo(cx, cy - 6);
    ctx.lineTo(cx, cy + 6);
    ctx.stroke();
  };
  cross(24, 24);
  cross(width - 24, 24);
  cross(24, height - 24);
  cross(width - 24, height - 24);

  // Top Bar: Category & Node Tag
  ctx.font = "bold 13px ui-monospace, SFMono-Regular, monospace";
  ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
  ctx.fillText(project.category.toUpperCase(), 32, 48);

  const nodeId = `SYS: 0x${project.id.replace("proj-", "").padStart(4, "0")}`;
  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.fillText(nodeId, width - 32, 48);
  ctx.textAlign = "left";

  // Badge pill
  ctx.fillStyle = project.badge === "Case" ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.08)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
  ctx.fillRect(32, 64, 64, 22);
  ctx.strokeRect(32, 64, 64, 22);
  ctx.font = "bold 11px ui-monospace, SFMono-Regular, monospace";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(`[${project.badge}]`, 42, 79);

  // Year Tag
  ctx.font = "11px ui-monospace, SFMono-Regular, monospace";
  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.fillText(`${project.year}`, 108, 79);

  // Title: Big bold grotesk typography
  ctx.font = "bold 28px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillStyle = "#ffffff";

  // Simple multi-line text wrapping for title
  const words = project.title.split(" ");
  let line = "";
  let y = 142;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > width - 64 && n > 0) {
      ctx.fillText(line.trim(), 32, y);
      line = words[n] + " ";
      y += 34;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), 32, y);

  // Subtitle
  ctx.font = "14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
  ctx.fillText(project.subtitle.slice(0, 48) + (project.subtitle.length > 48 ? "..." : ""), 32, y + 26);

  // Accent Color Bar at bottom
  ctx.fillStyle = project.accentColor || "#ffffff";
  ctx.fillRect(32, height - 52, width - 64, 2);

  // Bottom Footer Meta
  ctx.font = "11px ui-monospace, SFMono-Regular, monospace";
  ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
  const statText = project.stats?.[0] ? `${project.stats[0].label}: ${project.stats[0].value}` : "STATUS: ACTIVE";
  ctx.fillText(statText.toUpperCase(), 32, height - 32);

  ctx.textAlign = "right";
  ctx.fillText("TAP / CLICK TO VIEW ->", width - 32, height - 32);
  ctx.textAlign = "left";

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

export function useThreeSphere({
  projects,
  radius = 280,
  onHoverProject,
  onSelectProject,
}: UseThreeSphereOptions): UseThreeSphereReturn {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [coords, setCoords] = useState<SphericalCoordinates>({
    lat: 0,
    lon: 0,
    phi: 0,
    theta: 0,
  });

  // Scene references maintained across renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cardsGroupRef = useRef<THREE.Group | null>(null);
  const cardMeshesRef = useRef<THREE.Mesh[]>([]);
  const hoveredMeshRef = useRef<THREE.Mesh | null>(null);

  // Physics state
  const angularVelocityRef = useRef<THREE.Vector2>(new THREE.Vector2(0, 0.0012));
  const isDraggingRef = useRef(false);
  const lastPointerPosRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const rafIdRef = useRef<number>(0);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const pointerNdcRef = useRef<THREE.Vector2>(new THREE.Vector2(-10, -10));

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === "undefined") return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // 1. Initialize Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Initialize Perspective Camera
    const camera = new THREE.PerspectiveCamera(48, width / height, 1, 2500);
    camera.position.set(0, 0, 720);
    cameraRef.current = camera;

    // 3. Initialize WebGL Renderer with DPR clamping (max 2.0)
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.0));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Ambient and Directional Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight1.position.set(300, 400, 500);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight2.position.set(-300, -300, -400);
    scene.add(dirLight2);

    // 5. Cards Group & Fibonacci Placement
    const cardsGroup = new THREE.Group();
    cardsGroupRef.current = cardsGroup;
    scene.add(cardsGroup);

    // Decorative Swiss wireframe sphere lattice
    const sphereGeo = new THREE.IcosahedronGeometry(radius * 0.98, 2);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.045,
    });
    const wireframeSphere = new THREE.Mesh(sphereGeo, sphereMat);
    cardsGroup.add(wireframeSphere);

    // Equatorial and Meridian guideline rings
    const ringGeo = new THREE.RingGeometry(radius * 0.99, radius * 1.002, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide,
    });
    const equatorRing = new THREE.Mesh(ringGeo, ringMat);
    equatorRing.rotation.x = Math.PI / 2;
    cardsGroup.add(equatorRing);

    // Generate Fibonacci distribution points
    const points = calculateFibonacciSpherePoints(projects.length, radius);
    const cardMeshes: THREE.Mesh[] = [];

    const cardWidth = 112;
    const cardHeight = 75;
    const cardGeometry = new THREE.PlaneGeometry(cardWidth, cardHeight);

    points.forEach((pt, index) => {
      const project = projects[index];
      if (!project) return;

      const texture = createProjectCardTexture(project);
      const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.35,
        metalness: 0.1,
        side: THREE.DoubleSide,
        emissive: new THREE.Color(0x000000),
      });

      const mesh = new THREE.Mesh(cardGeometry, material);
      mesh.position.set(pt.x, pt.y, pt.z);

      // Normal outward orientation along radial vector
      const normal = new THREE.Vector3(pt.x, pt.y, pt.z).normalize();
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);

      mesh.userData = {
        project,
        originalPosition: mesh.position.clone(),
        index,
        phi: pt.phi,
        theta: pt.theta,
      };

      cardMeshes.push(mesh);
      cardsGroup.add(mesh);
    });

    cardMeshesRef.current = cardMeshes;

    // 6. Interaction Event Handlers
    const onPointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      setIsDragging(true);
      lastPointerPosRef.current.set(e.clientX, e.clientY);
      angularVelocityRef.current.set(0, 0);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX;
      const clientY = e.clientY;

      // Update NDC coordinates for Raycaster
      pointerNdcRef.current.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdcRef.current.y = -(((clientY - rect.top) / rect.height) * 2 - 1);

      if (isDraggingRef.current) {
        const dx = clientX - lastPointerPosRef.current.x;
        const dy = clientY - lastPointerPosRef.current.y;

        const sensitivity = 0.0035;
        angularVelocityRef.current.set(dy * sensitivity, dx * sensitivity);

        // Quaternion rotation around view axes
        const qY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), dx * sensitivity);
        const qX = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), dy * sensitivity);

        cardsGroup.quaternion.premultiply(qY);
        cardsGroup.quaternion.premultiply(qX);

        lastPointerPosRef.current.set(clientX, clientY);
      }
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
      setIsDragging(false);
    };

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      raycasterRef.current.setFromCamera(new THREE.Vector2(x, y), camera);
      const intersects = raycasterRef.current.intersectObjects(cardMeshesRef.current, false);

      if (intersects.length > 0) {
        const hit = intersects[0];
        const proj = hit.object.userData.project as ProjectItem;
        if (proj) {
          playHapticClick(880);
          if (onSelectProject) {
            onSelectProject(proj);
          } else if (proj.externalUrl) {
            window.open(proj.externalUrl, "_blank", "noopener,noreferrer");
          }
        }
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomDelta = e.deltaY * 0.45;
      camera.position.z = Math.max(450, Math.min(1050, camera.position.z + zoomDelta));
    };

    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    container.addEventListener("click", onClick);
    container.addEventListener("wheel", onWheel, { passive: false });

    // Handle Resize
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 600;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);

    // 7. Render Loop with Momentum Inertia & Raycasting
    let lastTime = performance.now();
    let frameCounter = 0;

    const animate = (currentTime: number) => {
      rafIdRef.current = requestAnimationFrame(animate);

      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Inertia decay and idle ambient drift
      if (!isDraggingRef.current) {
        angularVelocityRef.current.multiplyScalar(0.94);

        if (angularVelocityRef.current.lengthSq() < 0.000001) {
          // Smooth blend to subtle ambient idle drift
          angularVelocityRef.current.y = THREE.MathUtils.lerp(angularVelocityRef.current.y, 0.0008, 0.04);
          angularVelocityRef.current.x = THREE.MathUtils.lerp(angularVelocityRef.current.x, 0.0001, 0.04);
        }

        const deltaEuler = new THREE.Euler(angularVelocityRef.current.x, angularVelocityRef.current.y, 0, "XYZ");
        const deltaQ = new THREE.Quaternion().setFromEuler(deltaEuler);
        cardsGroup.quaternion.premultiply(deltaQ);
      }

      // Update Live Spherical Coordinates Readout
      frameCounter++;
      if (frameCounter % 5 === 0) {
        const euler = new THREE.Euler().setFromQuaternion(cardsGroup.quaternion, "YXZ");
        const lat = THREE.MathUtils.radToDeg(euler.x);
        const lon = THREE.MathUtils.radToDeg(euler.y);
        const phi = (euler.x + Math.PI / 2) % Math.PI;
        const theta = (euler.y + Math.PI) % (2 * Math.PI);

        setCoords({ lat, lon, phi, theta });
      }

      // Raycasting Hover Detection
      if (!isDraggingRef.current) {
        raycasterRef.current.setFromCamera(pointerNdcRef.current, camera);
        const intersects = raycasterRef.current.intersectObjects(cardMeshesRef.current, false);

        if (intersects.length > 0) {
          const hit = intersects[0];
          const hitMesh = hit.object as THREE.Mesh;

          if (hoveredMeshRef.current !== hitMesh) {
            // Reset previously hovered mesh
            if (hoveredMeshRef.current) {
              gsap.to(hoveredMeshRef.current.scale, {
                x: 1.0,
                y: 1.0,
                z: 1.0,
                duration: 0.25,
                overwrite: "auto",
              });
              const prevMat = hoveredMeshRef.current.material as THREE.MeshStandardMaterial;
              prevMat.emissive.setHex(0x000000);
            }

            // Animate newly hovered mesh
            hoveredMeshRef.current = hitMesh;
            gsap.to(hitMesh.scale, {
              x: 1.15,
              y: 1.15,
              z: 1.15,
              duration: 0.25,
              overwrite: "auto",
            });
            const mat = hitMesh.material as THREE.MeshStandardMaterial;
            mat.emissive.setHex(0x282828);

            const proj = hitMesh.userData.project as ProjectItem;
            setActiveProject(proj);
            playHapticClick(980);

            if (onHoverProject) {
              const worldPos = new THREE.Vector3();
              hitMesh.getWorldPosition(worldPos);
              const screenVec = worldPos.clone().project(camera);
              const screenX = ((screenVec.x + 1) / 2) * width;
              const screenY = ((-screenVec.y + 1) / 2) * height;
              onHoverProject(proj, { x: screenX, y: screenY });
            }
          }
        } else if (hoveredMeshRef.current) {
          // No intersection: reset state
          gsap.to(hoveredMeshRef.current.scale, {
            x: 1.0,
            y: 1.0,
            z: 1.0,
            duration: 0.25,
            overwrite: "auto",
          });
          const mat = hoveredMeshRef.current.material as THREE.MeshStandardMaterial;
          mat.emissive.setHex(0x000000);
          hoveredMeshRef.current = null;
          setActiveProject(null);

          if (onHoverProject) {
            onHoverProject(null);
          }
        }
      }

      renderer.render(scene, camera);
    };

    rafIdRef.current = requestAnimationFrame(animate);

    // 8. Deterministic Cleanup on unmount or view toggle
    return () => {
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("click", onClick);
      container.removeEventListener("wheel", onWheel);
      resizeObserver.disconnect();

      disposeThreeScene(scene, renderer, rafIdRef.current);
    };
  }, [projects, radius, onHoverProject, onSelectProject]);

  const zoomIn = useCallback(() => {
    playHapticClick(850);
    if (!cameraRef.current) return;
    const targetZ = Math.max(450, cameraRef.current.position.z - 80);
    gsap.to(cameraRef.current.position, { z: targetZ, duration: 0.35, ease: "power2.out" });
  }, []);

  const zoomOut = useCallback(() => {
    playHapticClick(800);
    if (!cameraRef.current) return;
    const targetZ = Math.min(1050, cameraRef.current.position.z + 80);
    gsap.to(cameraRef.current.position, { z: targetZ, duration: 0.35, ease: "power2.out" });
  }, []);

  const resetView = useCallback(() => {
    playHapticClick(900);
    if (cameraRef.current) {
      gsap.to(cameraRef.current.position, { z: 720, duration: 0.5, ease: "power3.out" });
    }
    if (cardsGroupRef.current) {
      const qIdentity = new THREE.Quaternion();
      const currentQ = cardsGroupRef.current.quaternion.clone();
      const dummy = { t: 0 };
      gsap.to(dummy, {
        t: 1,
        duration: 0.65,
        ease: "power3.out",
        onUpdate: () => {
          if (cardsGroupRef.current) {
            cardsGroupRef.current.quaternion.slerpQuaternions(currentQ, qIdentity, dummy.t);
          }
        },
      });
    }
  }, []);

  return {
    containerRef,
    activeProject,
    coords,
    zoomIn,
    zoomOut,
    resetView,
    isDragging,
  };
}
