export type EquipmentCategory =
  | 'pile-testing'
  | 'drilling'
  | 'laboratory'
  | 'geophysical'
  | 'field-testing';

export interface EquipmentSpec {
  name: string;
  value: string;
}

export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  description: string;
  images: string[];
  specifications: EquipmentSpec[];
  capacity: string;
  specSheetPDF?: string;
}
