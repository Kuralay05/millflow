"use client";

import { Card } from "@/components/ui/card";
import { useLanguage } from "@/hooks/use-language";

const content = {
  ru: {
    intro: "Цифровая платформа для управления ключевыми процессами мукомольного предприятия.",
    purpose: "Назначение системы",
    purposeText:
      "MillFlow предназначена для автоматизации приема зерна, учета производственных партий, управления складскими остатками и контроля отгрузок на мукомольном предприятии.",
    objectives: "Основные задачи",
    objectivesText:
      "Система централизует данные, ускоряет операционный учет, повышает прозрачность движения сырья и готовой продукции и помогает контролировать производственные показатели в едином интерфейсе.",
    modules: "Функциональные модули",
    modulesText:
      "Панель управления, прием зерна, производство, склад, отгрузки, отчеты и журнал действий пользователей.",
    roles: "Роли пользователей",
    rolesText:
      "Администратор управляет всей системой, оператор работает с приемом зерна и производством, а менеджер склада отвечает за складской учет и отгрузки.",
    benefits: "Преимущества для предприятия",
    benefitsText:
      "Использование MillFlow снижает объем ручного учета, помогает быстрее находить нужную информацию, уменьшает риск ошибок и делает бизнес-процессы более управляемыми."
  },
  en: {
    intro: "Digital platform for managing core operations of a flour mill enterprise.",
    purpose: "System Purpose",
    purposeText:
      "MillFlow is designed to automate grain intake, production batch accounting, warehouse stock management and shipment control in a flour mill enterprise.",
    objectives: "Main Objectives",
    objectivesText:
      "The system centralizes operational data, speeds up record keeping, improves visibility of raw material and finished product movement, and helps monitor production performance in one interface.",
    modules: "Functional Modules",
    modulesText:
      "Dashboard, grain intake, production, warehouse, shipments, reports and user action log.",
    roles: "User Roles",
    rolesText:
      "The administrator manages the full platform, the operator handles grain intake and production, and the warehouse manager is responsible for stock and shipments.",
    benefits: "Business Benefits",
    benefitsText:
      "MillFlow reduces manual work, helps teams find operational information faster, lowers the risk of errors and makes mill processes more manageable."
  },
  kk: {
    intro: "Диірмен кәсіпорнының негізгі үдерістерін басқаруға арналған цифрлық платформа.",
    purpose: "Жүйенің мақсаты",
    purposeText:
      "MillFlow астық қабылдауды, өндірістік партияларды есепке алуды, қойма қорларын басқаруды және жөнелтуді бақылауды автоматтандыруға арналған.",
    objectives: "Негізгі міндеттері",
    objectivesText:
      "Жүйе операциялық деректерді орталықтандырады, есеп жүргізуді жеделдетеді, шикізат пен дайын өнім қозғалысының ашықтығын арттырады және өндірістік көрсеткіштерді бір интерфейстен бақылауға мүмкіндік береді.",
    modules: "Функционалдық модульдер",
    modulesText:
      "Басқару тақтасы, астық қабылдау, өндіріс, қойма, жөнелту, есептер және пайдаланушылар әрекеттерінің журналы.",
    roles: "Пайдаланушы рөлдері",
    rolesText:
      "Әкімші бүкіл жүйені басқарады, оператор астық қабылдау мен өндіріс бойынша жұмыс істейді, ал қойма менеджері қорлар мен жөнелтуді бақылайды.",
    benefits: "Кәсіпорынға беретін пайдасы",
    benefitsText:
      "MillFlow қолмен есеп жүргізу көлемін азайтады, қажетті ақпаратты тез табуға көмектеседі, қателер қаупін төмендетеді және өндірістік үдерістерді тиімдірек басқаруға мүмкіндік береді."
  }
} as const;

export function AboutView() {
  const { language } = useLanguage();
  const section = content[language];

  const sections = [
    { title: section.purpose, text: section.purposeText },
    { title: section.objectives, text: section.objectivesText },
    { title: section.modules, text: section.modulesText },
    { title: section.roles, text: section.rolesText },
    { title: section.benefits, text: section.benefitsText }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-brand-50 to-wheat-50">
        <h2 className="text-2xl font-bold text-slate-900">MillFlow</h2>
        <p className="mt-2 text-sm text-slate-600">{section.intro}</p>
      </Card>

      {sections.map((item) => (
        <Card key={item.title}>
          <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
          <p className="mt-3 leading-7 text-slate-600">{item.text}</p>
        </Card>
      ))}
    </div>
  );
}
