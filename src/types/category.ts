export interface ICategory {
  id: number;
  name: string;
}

export interface IProductGroup {
  id: number;
  name: string;
  sname?: string | null;
  alias?: string | null;
  slug: string;
  icon?: string | null;
  group_under?: number | null;
  subgroups?: IProductGroup[];
  is_ecommerce_product: boolean;
}
