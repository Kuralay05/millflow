import mongoose from "mongoose";
import { loadEnvConfig } from "@next/env";
import { connectToDatabase } from "../lib/db/mongoose";
import User from "../models/User";
import Supplier from "../models/Supplier";
import GrainBatch from "../models/GrainBatch";
import ProductionBatch from "../models/ProductionBatch";
import InventoryItem from "../models/InventoryItem";
import Shipment from "../models/Shipment";
import AuditLog from "../models/AuditLog";
import { normalizeInventoryStatus } from "../lib/db/helpers";
import { demoUsers } from "../data/demo-users";

loadEnvConfig(process.cwd());

async function seed() {
  await connectToDatabase();

  await Promise.all([
    User.deleteMany({}),
    Supplier.deleteMany({}),
    GrainBatch.deleteMany({}),
    ProductionBatch.deleteMany({}),
    InventoryItem.deleteMany({}),
    Shipment.deleteMany({}),
    AuditLog.deleteMany({})
  ]);

  const users = await User.insertMany(demoUsers);

  const suppliers = await Supplier.insertMany([
    {
      name: "ТОО АгроДән",
      contactPerson: "Марат Ибраев",
      phone: "+7 701 100 2301",
      address: "Кызылординская область, Сырдарьинский район"
    },
    {
      name: "ИП Северное Зерно",
      contactPerson: "Алексей Воронов",
      phone: "+7 701 200 4421",
      address: "Костанайская область, г. Тобыл"
    },
    {
      name: "ТОО Steppe Grain Supply",
      contactPerson: "Ерлан Жумашев",
      phone: "+7 702 310 9834",
      address: "Акмолинская область, г. Кокшетау"
    },
    {
      name: "ТОО Harvest Trade",
      contactPerson: "Сергей Беляев",
      phone: "+7 747 555 1200",
      address: "Северо-Казахстанская область, г. Петропавловск"
    },
    {
      name: "ИП Алтын Бидай",
      contactPerson: "Айгуль Сапарова",
      phone: "+7 705 881 0022",
      address: "Туркестанская область, г. Шымкент"
    }
  ]);

  const grainBatches = await GrainBatch.insertMany([
    ["GB-240401", 0, "Пшеница 3 класса", 28500, 12.4, "2026-04-01", "Принято", "Без замечаний"],
    ["GB-240402", 1, "Пшеница 4 класса", 24200, 13.1, "2026-04-02", "Принято", "Партия стабильного качества"],
    ["GB-240403", 2, "Твердая пшеница", 19800, 11.8, "2026-04-03", "На проверке", "Ожидается лабораторное заключение"],
    ["GB-240404", 3, "Пшеница 3 класса", 30100, 12.7, "2026-04-04", "Принято", "Отгружено авто-транспортом"],
    ["GB-240405", 4, "Пшеница 5 класса", 17400, 14.5, "2026-04-05", "Отклонено", "Повышенная влажность"],
    ["GB-240406", 0, "Пшеница 3 класса", 28950, 12.2, "2026-04-06", "Принято", "Рекомендуется к производству"],
    ["GB-240407", 2, "Пшеница 4 класса", 22340, 13.5, "2026-04-07", "Принято", "Нормальные показатели"],
    ["GB-240408", 1, "Твердая пшеница", 20700, 12.1, "2026-04-08", "На проверке", "Повторный анализ клейковины"],
    ["GB-240409", 3, "Пшеница 3 класса", 31550, 11.9, "2026-04-09", "Принято", "Срочная приемка"],
    ["GB-240410", 4, "Пшеница 4 класса", 26480, 12.8, "2026-04-10", "Принято", "Склад силос №3"]
  ].map(([batchNumber, supplierIndex, grainType, weightKg, moisturePercent, intakeDate, qualityStatus, notes]) => ({
    batchNumber,
    supplierId: suppliers[supplierIndex as number]._id,
    grainType,
    weightKg,
    moisturePercent,
    intakeDate,
    qualityStatus,
    notes
  })));

  await ProductionBatch.insertMany([
    ["PB-240501", 0, "2026-04-11", 19840, 1290, "Завершено", "Производство муки высшего сорта"],
    ["PB-240502", 1, "2026-04-12", 17260, 1140, "Завершено", "Стандартный выход продукции"],
    ["PB-240503", 3, "2026-04-13", 21410, 1350, "Завершено", "Минимальные технологические потери"],
    ["PB-240504", 5, "2026-04-14", 20180, 1265, "Завершено", "План выполнен"],
    ["PB-240505", 6, "2026-04-15", 16720, 1180, "В процессе", "Идет фасовка"],
    ["PB-240506", 8, "2026-04-16", 22540, 1420, "В процессе", "Ожидается завершение смены"],
    ["PB-240507", 9, "2026-04-17", 18910, 1225, "Завершено", "Выпуск муки первого сорта"],
    ["PB-240508", 2, "2026-04-18", 15430, 980, "В процессе", "Партия ожидает подтверждения качества"]
  ].map(([batchNumber, grainIndex, productionDate, flourProducedKg, wasteKg, status, notes]) => ({
    batchNumber,
    grainBatchId: grainBatches[grainIndex as number]._id,
    productionDate,
    flourProducedKg,
    wasteKg,
    status,
    notes
  })));

  await InventoryItem.insertMany([
    ["Мука высший сорт 50 кг", "Мука", "PB-240501", 8200, "Склад А-1"],
    ["Мука 1 сорт 25 кг", "Мука", "PB-240507", 4200, "Склад А-2"],
    ["Отруби кормовые", "Отруби", "PB-240503", 1650, "Склад B-1"],
    ["Зерно на переработку", "Зерно", "GB-240403", 19800, "Силос 2"],
    ["Мука высший сорт 10 кг", "Мука", "PB-240504", 3150, "Склад А-3"],
    ["Отруби гранулированные", "Отруби", "PB-240506", 980, "Склад B-2"],
    ["Зерно резервное", "Зерно", "GB-240408", 7200, "Силос 4"],
    ["Мука 2 сорт 50 кг", "Мука", "PB-240502", 0, "Склад А-4"],
    ["Премикс мукомольный", "Мука", "PB-240505", 1460, "Склад А-5"],
    ["Зерновые отходы", "Отруби", "PB-240508", 540, "Склад B-3"]
  ].map(([productName, productType, batchNumber, quantityKg, location]) => ({
    productName,
    productType,
    batchNumber,
    quantityKg,
    location,
    status: normalizeInventoryStatus(quantityKg as number),
    lastUpdated: new Date()
  })));

  await Shipment.insertMany([
    ["SH-240601", "ТОО Нан Market", "Мука высший сорт 50 кг", "PB-240501", 2400, "2026-04-12", "Доставлено"],
    ["SH-240602", "ИП Астана Хлеб", "Мука 1 сорт 25 кг", "PB-240507", 1600, "2026-04-13", "Отгружено"],
    ["SH-240603", "ТОО Bakery Mix", "Отруби кормовые", "PB-240503", 800, "2026-04-14", "Подготовка"],
    ["SH-240604", "ИП Дәмді Нан", "Мука высший сорт 10 кг", "PB-240504", 950, "2026-04-15", "Доставлено"],
    ["SH-240605", "ТОО Agro Feed", "Отруби гранулированные", "PB-240506", 600, "2026-04-16", "Отгружено"],
    ["SH-240606", "ТОО Торговый Дом Арна", "Мука высший сорт 50 кг", "PB-240501", 2100, "2026-04-17", "Подготовка"],
    ["SH-240607", "ИП Керуен", "Мука 1 сорт 25 кг", "PB-240507", 1200, "2026-04-18", "Доставлено"],
    ["SH-240608", "ТОО South Flour Trade", "Премикс мукомольный", "PB-240505", 500, "2026-04-19", "Подготовка"]
  ].map(([shipmentNumber, customerName, productName, batchNumber, quantityKg, shipmentDate, status]) => ({
    shipmentNumber,
    customerName,
    productName,
    batchNumber,
    quantityKg,
    shipmentDate,
    status
  })));

  await AuditLog.insertMany([
    {
      action: "LOGIN",
      entityType: "User",
      entityId: String(users[0]._id),
      userEmail: "admin@millflow.local",
      timestamp: new Date("2026-04-18T08:20:00.000Z"),
      details: "Администратор вошел в систему"
    },
    {
      action: "CREATE",
      entityType: "GrainBatch",
      entityId: String(grainBatches[0]._id),
      userEmail: "operator@millflow.local",
      timestamp: new Date("2026-04-18T09:00:00.000Z"),
      details: "Создана партия зерна GB-240401"
    },
    {
      action: "UPDATE",
      entityType: "ProductionBatch",
      entityId: new mongoose.Types.ObjectId().toString(),
      userEmail: "operator@millflow.local",
      timestamp: new Date("2026-04-18T10:10:00.000Z"),
      details: "Обновлен статус производственной партии PB-240505"
    },
    {
      action: "CREATE",
      entityType: "Shipment",
      entityId: new mongoose.Types.ObjectId().toString(),
      userEmail: "warehouse@millflow.local",
      timestamp: new Date("2026-04-18T11:40:00.000Z"),
      details: "Создана отгрузка SH-240608"
    },
    {
      action: "UPDATE",
      entityType: "InventoryItem",
      entityId: new mongoose.Types.ObjectId().toString(),
      userEmail: "warehouse@millflow.local",
      timestamp: new Date("2026-04-19T07:55:00.000Z"),
      details: "Обновлен остаток по позиции Отруби гранулированные"
    }
  ]);

  console.log("MillFlow seed completed");
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
