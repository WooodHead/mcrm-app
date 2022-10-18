import { store } from "~root/state";

require('dotenv').config();
import { Neo4jService } from "~root/neo4j/neo4j.service";
import { Test, TestingModule } from '@nestjs/testing';
import { PageService } from './page.service';
import { PageCategoryService } from './page-category.service';
import { ModelsService } from "~admin/services/models.service";
import { NEO4J_CONFIG, NEO4J_DRIVER } from "~root/neo4j/neo4j.constants";
import { defaultNeo4JConfig } from "~root/neo4j/neo4j.module";
import { ConfigModule } from "@nestjs/config";
import { Neo4jConfig } from "~root/neo4j/neo4j-config.interface";
import { createDriver } from "~root/neo4j/neo4j.util";
import { PageModel } from "../models/page.model";
import { SharedModule } from "~shared/shared.module";
import { crudOperator } from "~helpers/crudOperator";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { PageCategoryModel } from "../models/page-category.model";

describe('PageService', () => {
  let service: PageService;
  let pageCategoryService: PageCategoryService;

  const pageItem = Object.freeze({
    title: 'My page',
    slug: 'My page'
  });

  const pageCategoryItem = Object.freeze({
    title: 'My category',
    description: 'My description'
  });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        EventEmitterModule.forRoot({
          wildcard: true,
          delimiter: ".",
          verboseMemoryLeak: true
        }),
      ],
      providers: [
        {
          provide: NEO4J_CONFIG,
          useValue: defaultNeo4JConfig,
        },
        {
          provide: NEO4J_DRIVER,
          useFactory: (config: Neo4jConfig) => {
            if (!config) {
              config = defaultNeo4JConfig;
            }
            return createDriver(config);
          }
        },
        Neo4jService,
        ModelsService,
        PageModel,
        PageCategoryModel,
        SharedModule,
      ]
    }).compile();

    const neo4jService = module.get<Neo4jService>(Neo4jService);//Load the Neo4j service
    const driver = await createDriver(defaultNeo4JConfig);// Initialize the driver
    neo4jService.setDriver(driver);// Manually add the driver instance cause the DI is worthless
    Neo4jService.driverInstance = driver;// Associate the driver

    const modelService: ModelsService = module.get<ModelsService>(ModelsService);//Get the model service so that we can load them into the store
    await modelService.mergeModels();// Load all the models into the store
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
      ],
      providers: [
        PageService,
        PageCategoryService
      ],
    }).compile();


    service = module.get<PageService>(PageService);
    pageCategoryService = module.get<PageCategoryService>(PageCategoryService);
    service.setModel(store.getState().models['Page']);
    pageCategoryService.setModel(store.getState().models['PageCategory']);
  });

  // it('should be defined', () => {
  //   expect(service).toBeDefined();
  // });


  // it("should save page to db", async () => {
  //   const pageCrudOperator = crudOperator(service, pageItem);
  //   const createdPage = await pageCrudOperator.create();

  //   expect(createdPage.title).toEqual(pageItem.title);
  //   expect(createdPage.slug).toEqual('my-page');

  //   await pageCrudOperator.delete();
  // });

  // 
  // it("should delete the page to db", async () => {
  //   const pageCrudOperator = crudOperator(service, pageItem);
  //   await pageCrudOperator.create();
  //   const deletedPage = await pageCrudOperator.delete();

  //   expect(deletedPage.success).toEqual(true);
  // });


  // it("should save and find the page in db", async () => {
  //   const pageCrudOperator = crudOperator(service, pageItem);
  //   await pageCrudOperator.create();

  //   const foundPage = await pageCrudOperator.findOne(); 
  //   expect(foundPage.title).toEqual(pageItem.title);
  //   expect(foundPage.slug).toEqual('my-page');

  //   await pageCrudOperator.delete();
  // });

  // it("should save and update the page in db", async () => {
  //   const pageCrudOperator = crudOperator(service, pageItem);
  //   await pageCrudOperator.create();
  //   await pageCrudOperator.update({ title: 'Updated title'});

  //   const foundPage = await pageCrudOperator.findOne(); 
  //   expect(foundPage.title).toEqual('Updated title');
  //   expect(foundPage.slug).toEqual('my-page');

  //   await pageCrudOperator.delete();
  // });

  // it("should save page with category in db", async () => {
  //   const pageCrudOperator  = crudOperator(service, pageItem);
  //   const crudCategoryOperator = crudOperator(pageCategoryService, pageCategoryItem);
  //   const page = await pageCrudOperator.create();
  //   const pageCategory = await crudCategoryOperator.create();

  //   const relationship = await service.attachModelToAnotherModel(
  //     store.getState().models['Page'], 
  //     {
  //       uuid: page.uuid
  //     },
  //     store.getState().models["PageCategory"], 
  //     {
  //       uuid: pageCategory.uuid
  //     }, 'category'
  //   );
  //   
  //   expect(relationship.success).toBe(true);

  //   await pageCrudOperator.delete();
  //   await crudCategoryOperator.delete();
  // });

  it("should delete category from page", async () => {
    const pageCrudOperator  = crudOperator(service, pageItem);
    const categoryCrudOperator = crudOperator(pageCategoryService, pageCategoryItem);
    const category2CrudOperator = crudOperator(pageCategoryService, pageCategoryItem);

    const page = await pageCrudOperator.create();
    const pageCategory = await categoryCrudOperator.create();
    const pageCategory2 = await category2CrudOperator.create();

    await service.attachModelToAnotherModel(
      store.getState().models['Page'], 
      {
        uuid: page.uuid
      },
      store.getState().models["PageCategory"], 
      {
        uuid: pageCategory.uuid
      }, 'category'
    );

    await service.attachModelToAnotherModel(
      store.getState().models['Page'], 
      {
        uuid: page.uuid
      },
      store.getState().models["PageCategory"], 
      {
        uuid: pageCategory2.uuid
      }, 'category'
    );
 

    const deletedRelationShip1 = await service.detachOneModelFromAnother(
      'Page',
      {
        uuid: page.uuid
      },
      "PageCategory", 
      {
        uuid: pageCategory.uuid
      }, 'HAS_CATEGORY'
    );

    const deletedRelationShip2 = await service.detachOneModelFromAnother(
      'Page',
      {
        uuid: page.uuid
      },
      "PageCategory", 
      {
        uuid: pageCategory2.uuid
      }, 'HAS_CATEGORY'
    );


    expect(deletedRelationShip1.deletedCount).toBe(1);
    expect(deletedRelationShip2.deletedCount).toBe(1);
    expect(page.title).toBe(pageItem.title);

    await pageCrudOperator.delete();
    await categoryCrudOperator.delete();
    await category2CrudOperator.delete();
  });
});

