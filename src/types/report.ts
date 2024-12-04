export type ReportType = 'projects' | 'users' | 'reviews' | 'statistics';

export interface ReportFilter {
  field: string;
  operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'between' | 'in';
  value: any;
}

export interface ReportColumn {
  field: string;
  header: string;
  width?: number;
}

export interface ReportData {
  columns: ReportColumn[];
  rows: any[];
}

export interface ReportConfig {
  title: string;
  sheetName: string;
  columns: ReportColumn[];
  filters?: ReportFilter[];
}