import { IGenericObject } from './general';
import { BaseModel } from './generic.model';

export interface IDynamicFieldConfigSettingsBluePrint {}

export interface IDynamicFieldConfigPasswordSettingsBluePrint
  extends IDynamicFieldConfigSettingsBluePrint {
  confirmRequired: boolean;
}

export interface IDynamicFieldConfigImageSettingsBluePrint
  extends IDynamicFieldConfigSettingsBluePrint {
  width?: number;
  height?: number;
  quality?: number;
}

interface IDynamicFieldSelectOption {
  label: string;
  value: string | number | boolean | null;
  default?: boolean;
}

interface IDynamicFieldItemSelectorConfig {
  module: string;
  multiple?: boolean;
  slices?: string[];
  tabs?: string[];
  resultDisplayField?: string; // What to show once a value of object was selected
  translatable?: boolean; // If it's a translatable field show default translation
}

export interface DynamicFieldOnValueChange extends BaseModel {
  field: IDynamicFieldConfigBlueprint;
  value: any;
}

export interface IDynamicFieldConfigBlueprint<ISettingsType = any> {
  varName: string;
  label: string;
  hint?: string;
  type: string;
  placeholder?: string;
  default?: any;
  translatable?: boolean;
  required?: boolean;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  group?: string;
  order?: number;
  settings?: {
    //Specific settings
    allowDeSelect?: boolean; //Allow radio button to be de selected Checkbox default to true, radio button default to false
    useValue?: boolean; //If true, object selector will return value property not the whole object (false default)
    options?: { varName: string; label: string; value?: any }[]; //Array of options for RadioButtons, Selects etc.
    multiple?: boolean; //Multiple
    confirmRequired?: boolean; //Password confirmation
    virtualScroll?: boolean; //Use virtual scroll - for selects
    fields?: IDynamicFieldConfigBlueprint[]; //Fields for composite dynamic field
    mask?: string;
    fieldsPerRow?: number; //Number of dynamic fields per row
    hideEmailToButton?: boolean; //Used to hide the mail to button on email forms
  };
  config?: IGenericObject;
  options?: IDynamicFieldSelectOption[];
  itemSelectorConfig?: IDynamicFieldItemSelectorConfig;
  filterField?: string;
  fields?: IDynamicFieldConfigBlueprint[];

  [key: string]: any;
}

export interface IDynamicFieldParamConfigBlueprint {
  type: string;
  label: string;
  required: boolean;
  toSlug: string;
  multilingual: boolean;
}

export interface IDynamicFieldParamBlueprint {
  label: IDynamicFieldConfigBlueprint;
  varName: IDynamicFieldConfigBlueprint;
  placeholder: IDynamicFieldConfigBlueprint;
  description: IDynamicFieldConfigBlueprint;
  default: IDynamicFieldConfigBlueprint;
  required: IDynamicFieldConfigBlueprint;
  translatable: IDynamicFieldConfigBlueprint;
  step: IDynamicFieldConfigBlueprint;
  min: IDynamicFieldConfigBlueprint;
  max: IDynamicFieldConfigBlueprint;
  options: {
    params: IDynamicFieldConfigBlueprint;
    label: IDynamicFieldConfigBlueprint;
    value: IDynamicFieldConfigBlueprint;
  };
}

export interface IDynamicFieldBlueprint {
  label: string;
  type: string;
  params: IDynamicFieldParamBlueprint;
  settings: { [key: string]: IDynamicFieldParamConfigBlueprint };
  config: { [key: string]: IDynamicFieldParamConfigBlueprint };
  editableFields: IDynamicFieldConfigBlueprint[];
}

export interface IDynamicFieldError {
  field: string;
  message: string;
}

export interface IDynamicFieldModelChangeEvent {
  value: any;
  varName: string;
  lang?: string;
}
