export interface TableColumn {
    name: string; // UI friendly name
    dataKey: string; // actual column name
    inputType?: 'none' | 'float' | 'percentage';
    inputOptions?: string[];
    isEditable?: boolean;
    multiSelectValues?: string[];
    position?: 'right' | 'left'; // alignment position
    isViewable?: boolean;
    defaultValue?: string;
    hint?: string;
    style?: any;
    sticky?: boolean;
    actionButtonIcon?: string;
    actionButtonSvgIcon?: string;
    actionButtonTooltip?: string;
    actionLinkTooltip?: string;
    datePickerFilter?: (d: Date | null) => boolean;
    width?: string;  // (e.g. 100px or 10rem)
    clickable?: boolean;
    padding?: string;
    whiteSpace?: 'normal'|'nowrap';
    hasTotal?: boolean;
  }
  