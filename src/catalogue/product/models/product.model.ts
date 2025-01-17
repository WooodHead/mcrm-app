import { Injectable, OnModuleInit } from '@nestjs/common';
import { McmsDi } from '~helpers/mcms-component.decorator';
import {
  BaseModel,
  IBaseModelFilterConfig,
  INeo4jModel,
} from '~models/base.model';
import { IDynamicFieldConfigBlueprint } from '~admin/models/dynamicFields';
import { IQueryBuilderFieldBlueprint } from '~shared/models/queryBuilder';
import { PropertyService } from '~catalogue/property/property.service';

const modelName = 'Product';
@McmsDi({
  id: modelName,
  type: 'model',
})
@Injectable()
export class ProductModel extends BaseModel implements OnModuleInit {
  public modelName = modelName;
  public static modelName = modelName;
  public static defaultAggregationSize = 30;
  public title: string;
  public price = 0;
  public slug;
  public uuid: string;

  async onModuleInit() {}

  public static displayedColumns = ['title', 'category'];

  public static modelConfig: INeo4jModel = {
    select: 'product:Product',
    as: 'product',
    relationships: {
      variants: {
        model: 'ProductVariant',
        modelAlias: 'variants',
        alias: 'productVariantRelationship',
        type: 'normal',
        isCollection: true,
        rel: 'HAS_VARIANTS',
      },
      category: {
        model: 'ProductCategory',
        modelAlias: 'productCategory',
        alias: 'productCategoryRelationship',
        type: 'normal',
        isCollection: true,
        rel: 'HAS_CATEGORY',
      },
      categoryFilter: {
        rel: 'HAS_CATEGORY',
        alias: 'categoryFilterRelationship',
        model: 'productCategory',
        modelAlias: 'categoryFilter',
        type: 'normal',
        isCollection: true,
        defaultProperty: 'name',
      },
      owner: {
        rel: 'IS_OWNER',
        alias: 'ownerRelationship',
        model: 'User',
        modelAlias: 'owner',
        type: 'inverse',
        isCollection: true,
        defaultProperty: 'firstName.lastName',
      },
      tags: {
        rel: 'HAS_TAGS',
        alias: 'tagRelationship',
        model: 'Tag',
        modelAlias: 'tag',
        type: 'normal',
        isCollection: true,
        isSortableCount: true,
        sortableCountDefaultAlias: 'tag',
        defaultProperty: 'name',
      },
      tag: {
        rel: 'HAS_TAGS',
        alias: 'tagRelationship',
        model: 'Tag',
        modelAlias: 'tag',
        type: 'normal',
        isCollection: true,
        defaultProperty: 'name',
      },
      tagCount: {
        rel: 'HAS_TAGS',
        alias: 'tagCountRelationship',
        model: 'Tag',
        modelAlias: 'tagCount',
        type: 'normal',
        isCollection: false,
        isCount: true,
      },
      related: {
        rel: 'IS_RELATED_TO',
        alias: 'relatedRelationship',
        model: 'product',
        modelAlias: 'related',
        type: 'normal',
        isCollection: true,
        defaultProperty: 'title',
      },
      properties: {
        rel: 'HAS_PROPERTY',
        alias: 'propertyRelationship',
        model: 'Property',
        modelAlias: 'property',
        type: 'normal',
        isCollection: true,
        isSortableCount: true,
        sortableCountDefaultAlias: 'property',
        defaultProperty: 'title',
        postProcessing: async (
          record: Record<any, any>,
          model: ProductModel,
        ) => {
          if (record.property) {
            record.property =
              await new PropertyService().propertiesWithValuesByModel(
                modelName,
                record.uuid,
                record.property.map((p) => p.uuid),
              );
          }

          return record;
        },
      },
      propertyValues: {
        rel: 'HAS_PROPERTY_VALUE',
        alias: 'propertyValueRelationship',
        model: 'PropertyValue',
        modelAlias: 'propertyValue',
        type: 'normal',
        isCollection: true,
        isSortableCount: true,
        sortableCountDefaultAlias: 'propertyValue',
        defaultProperty: 'name',
      },
      extraField: {
        rel: 'HAS_EXTRA_FIELD',
        alias: 'extraFieldRelationship',
        model: 'ExtraField',
        modelAlias: 'extraField',
        type: 'normal',
        isCollection: true,
      },
      creator: {
        rel: 'HAS_CREATED',
        alias: 'creatorRelationship',
        model: 'User',
        modelAlias: 'creator',
        type: 'inverse',
        isCollection: false,
        defaultProperty: 'firstName.lastName',
      },
      editor: {
        rel: 'HAS_EDITED',
        alias: 'editorRelationship',
        model: 'User',
        modelAlias: 'editor',
        type: 'inverse',
        isCollection: true,
        defaultProperty: 'firstName.lastName',
        addRelationshipData: true,
      },
      cart: {
        rel: 'HAS_PRODUCTS',
        alias: 'cartRelationship',
        model: 'Cart',
        modelAlias: 'cart',
        type: 'inverse',
        isCollection: true,
        defaultProperty: 'id',
      },
      manufacturer: {
        rel: 'HAS_MANUFACTURER',
        alias: 'manufacturerRelationship',
        model: 'Manufacturer',
        modelAlias: 'manufacturer',
        type: 'normal',
        isCollection: true,
        defaultProperty: 'id',
      },
    },
  };

  public static fields: IDynamicFieldConfigBlueprint[] = [
    {
      varName: 'sku',
      label: 'SKU',
      placeholder: 'SKU',
      type: 'text',
      isSortable: true,
      group: 'right',
      searchIndexSettings: {
        isAutoCompleteField: true,
      },
    },
    {
      varName: 'active',
      label: 'Active',
      placeholder: 'Active',
      type: 'boolean',
      isSortable: true,
      group: 'main',
    },
    {
      varName: 'title',
      label: 'Title',
      placeholder: 'Title',
      type: 'text',
      isSortable: true,
      group: 'main',
      searchIndexSettings: {
        isAutoCompleteField: true,
      },
    },
    {
      varName: 'slug',
      label: 'Slug',
      placeholder: 'Slug',
      type: 'text',
      group: 'hidden',
      isSlug: true,
      slugFrom: 'title',
    },
    {
      varName: 'description',
      label: 'Description',
      placeholder: 'Description',
      type: 'richText',
      isSortable: false,
      group: 'main',
      searchIndexSettings: {
        isAutoCompleteField: true,
      },
    },
    {
      varName: 'price',
      label: 'Price',
      placeholder: 'Price',
      type: 'number',
      isSortable: true,
      group: 'right',
      searchIndexSettings: {
        isAutoCompleteField: false,
        aggregationFieldSettings: {
          name: 'price',
          type: 'range',
          isKeyword: false,
          size: ProductModel.defaultAggregationSize,
          field: 'price',
          ranges: [
            { to: 60000.0 },
            { from: 60000.0, to: 100000.0 },
            { from: 100000.0, to: 500000.0 },
            { from: 500000.0, to: 1000000.0 },
            { from: 1000000.0 },
          ],
          boost: 2,
        },
      },
    },
    {
      varName: 'quantity',
      label: 'Quantity',
      placeholder: 'Quantity',
      type: 'number',
      isSortable: true,
      group: 'right',
    },
    {
      varName: 'thumb',
      label: 'Thumbnail',
      placeholder: 'Thumbnail',
      type: 'image',
      imageSettings: {
        multiple: true,
        accept: 'image/*',
        addFromUrl: true,
        selectFromMediaLibrary: true,
        showPreview: true,
        width: 250,
        height: 250,
        defaultCopy: 'thumb',
        maxFileSize: 5000,
        fileLimit: 5,
        quality: 70,
      },
      group: 'right',
    },
    {
      varName: 'updatedAt',
      label: 'Updated At',
      placeholder: 'Updated At',
      type: 'date',
      isSortable: true,
      group: 'hidden',
    },
    {
      varName: 'fromImport',
      label: 'fromImport',
      placeholder: 'fromImport',
      type: 'boolean',
      group: 'hidden',
      default: false,
    },
    {
      varName: 'deliverability',
      label: 'Deliverability',
      placeholder: 'Deliverability',
      type: 'nested',
      group: 'hidden',
      default: false,
      fields: [
        {
          varName: 'stock',
          label: 'Stock',
          placeholder: 'Stock',
          type: 'number',
          group: 'hidden',
          default: false,
        },
        {
          varName: 'clearanceSale',
          label: 'ClearanceSale',
          placeholder: 'ClearanceSale',
          type: 'boolean',
          group: 'hidden',
          default: false,
        },
      ],
    },
    {
      varName: 'seo',
      label: 'Seo',
      placeholder: 'Seo',
      type: 'nested',
      group: 'hidden',
      default: false,
      fields: [
        {
          varName: 'title',
          label: 'Title',
          placeholder: 'Title',
          type: 'string',
          group: 'hidden',
          default: false,
        },
        {
          varName: 'description',
          label: 'Description',
          placeholder: 'Description',
          type: 'string',
          group: 'hidden',
          default: false,
        },
        {
          varName: 'keywords',
          label: 'Keywords',
          placeholder: 'Keywords',
          type: 'string',
          group: 'hidden',
          default: false,
        },
        {
          varName: 'og_title',
          label: 'Og:Title',
          placeholder: 'Oh:Title',
          type: 'string',
          group: 'hidden',
          default: false,
        },
        {
          varName: 'og_image',
          label: 'Og:Image',
          placeholder: 'Og:Image',
          type: 'string',
          group: 'hidden',
          default: false,
        },
        {
          varName: 'og_description',
          label: 'Og:Description',
          placeholder: 'Og:Description',
          type: 'string',
          group: 'hidden',
          default: false,
        },
      ],
    },

    {
      varName: 'measuresAndPackaging',
      label: 'MeasuresAndPackaging',
      placeholder: 'MeasuresAndPackaging',
      type: 'nested',
      group: 'hidden',
      default: false,
      fields: [
        {
          varName: 'width',
          label: 'Width',
          placeholder: 'With',
          type: 'number',
          group: 'hidden',
          default: false,
        },
        {
          varName: 'height',
          label: 'Height',
          placeholder: 'Height',
          type: 'number',
          group: 'hidden',
          default: false,
        },
        {
          varName: 'length',
          label: 'Length',
          placeholder: 'Length',
          type: 'number',
          group: 'hidden',
          default: false,
        },
        {
          varName: 'weight',
          label: 'Weight',
          placeholder: 'Weight',
          type: 'number',
          group: 'hidden',
          default: false,
        },
        {
          varName: 'sellingUnit',
          label: 'SellingUnit',
          placeholder: 'SellingUnit',
          type: 'number',
          group: 'hidden',
          default: false,
        },
        {
          varName: 'scaleUnit',
          label: 'ScaleUnit',
          placeholder: 'ScaleUnit',
          type: 'number',
          group: 'hidden',
          default: false,
        },
        {
          varName: 'packagingUnit',
          label: 'PackagingUnit',
          placeholder: 'PackagingUnit',
          type: 'number',
          group: 'hidden',
          default: false,
        },
        {
          varName: 'basicUnit',
          label: 'BasicUnit',
          placeholder: 'BasicUnit',
          type: 'number',
          group: 'hidden',
          default: false,
        },
      ],
    },
  ];

  public static filterFields: IQueryBuilderFieldBlueprint[] = [
    {
      varName: 'title',
      label: 'Title',
      type: 'text',
      model: 'Product',
      filterType: 'partial',
      isInSimpleQuery: true,
    },
  ];

  public static filterConfig: IBaseModelFilterConfig = {
    filterParamName: 'q',
    defaultOrderBy: 'createdAt',
    defaultWay: 'DESC',
  };
}
