import { ContactChannel } from "@/types/portfolio";

export const CONTACT_CHANNELS: ContactChannel[] = [
  {
    platform: "Email",
    label: "arthurgregorius333@gmail.com",
    url: "mailto:arthurgregorius333@gmail.com",
    icon: "Mail",
    primary: true,
    handle: "arthurgregorius333@gmail.com",
    actionText: "Send Transmission"
  },
  {
    platform: "LinkedIn",
    label: "Arthur Gregorius Pongoh",
    url: "https://www.linkedin.com/in/arthur-gregorius-pongoh-125322248",
    icon: "Linkedin",
    primary: true,
    handle: "arthur-gregorius-pongoh",
    actionText: "Connect Profile"
  },
  {
    platform: "GitHub",
    label: "ArthurGvP123",
    url: "https://github.com/ArthurGvP123",
    icon: "Github",
    primary: true,
    handle: "@ArthurGvP123",
    actionText: "Inspect Repositories"
  },
  {
    platform: "WhatsApp",
    label: "+62 895-3256-05798",
    url: "https://wa.me/62895325605798",
    icon: "MessageCircle",
    primary: true,
    handle: "+62 895-3256-05798",
    actionText: "Direct Message"
  },
  {
    platform: "Instagram",
    label: "@arthurgvp",
    url: "https://www.instagram.com/arthurgvp",
    icon: "Instagram",
    primary: false,
    handle: "@arthurgvp",
    actionText: "Follow Updates"
  }
];

export const PRIMARY_EMAIL = "arthurgregorius333@gmail.com";
export const PRIMARY_LOCATION = "Rawamangun, Jakarta Timur, DKI Jakarta, Indonesia";
export const COORDINATES_JAKARTA = {
  lat: -6.1931,
  lng: 106.8837,
  label: "6°11'35.2\"S 106°53'01.3\"E",
  timezone: "UTC+07:00 (WIB)"
};
