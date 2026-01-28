/**
 * Shopify Product Taxonomy Types
 * Based on taxonomy.json structure
 */

export interface TaxonomyCategory {
  id: string;
  name: string;
  full_name: string;
  level: number;
  parent_id: string | null;
  attributes: TaxonomyAttribute[];
  children: TaxonomyCategoryRef[];
  ancestors: TaxonomyCategoryRef[];
}

export interface TaxonomyCategoryRef {
  id: string;
  name: string;
}

export interface TaxonomyAttribute {
  id: string;
  name: string;
  handle: string;
  description: string;
  extended: boolean;
  values?: string[];
  input_type?: AttributeInputType;
  required?: boolean;
}

export type AttributeInputType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'multi-select'
  | 'number'
  | 'boolean'
  | 'color';

export interface TaxonomyVertical {
  name: string;
  prefix: string;
  categories: TaxonomyCategory[];
}

export interface TaxonomyData {
  version: string;
  verticals: TaxonomyVertical[];
}

/**
 * Form attribute value (used in post item form)
 */
export interface AttributeValue {
  attribute_id: string;
  attribute_name: string;
  attribute_handle: string;
  value: string | string[] | number | boolean;
}
