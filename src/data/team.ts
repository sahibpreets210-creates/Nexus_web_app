export interface TeamMember {
  name: string;
  role: string;
  avatarLetter: string;
  imageUrl?: string;
  imagePosition?: string;
}

/** The Nexus core syndicate. Photographs live in /public/team. */
export const MEMBERS: TeamMember[] = [
  {
    name: 'Vinayak Shukla',
    role: 'President',
    avatarLetter: 'V',
  },
  {
    name: 'Anoushka Arya',
    role: 'Co-President',
    avatarLetter: 'A',
    imageUrl: '/team/anoushka.jpeg',
  },
  {
    name: 'Shatakshi Agarwal',
    role: 'Co-President',
    avatarLetter: 'S',
    imageUrl: '/team/shatakshi.jpeg',
  },
  {
    name: 'Aditi Thakur',
    role: 'Secretary',
    avatarLetter: 'A',
    imageUrl: '/team/aditi.jpeg',
  },
  {
    name: 'Sahibpreet Singh',
    role: 'Core Member',
    avatarLetter: 'S',
    imageUrl: '/team/sahibpreet-singh.jpeg',
  },
  {
    name: 'Aarav Lal',
    role: 'Core Member',
    avatarLetter: 'A',
    imageUrl: '/team/arav.jpeg',
  },
  {
    name: 'Anav Halder',
    role: 'Core Member',
    avatarLetter: 'A',
    imageUrl: '/team/anav.jpeg',
  },
];
