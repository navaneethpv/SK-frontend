export interface IBrand {
  id: number;
  description: string;  // Brand Full Name
  sdescription: string; // Brand Short Name
  alias: string;        // Brand Alias
  about1?: string | null;
  about2?: string | null;
  about3?: string | null;
  icon?: string | null;
  banner?: string | null;
  authorized_number?: string | null;
  email?: string | null;
  contact?: string | null;
}
