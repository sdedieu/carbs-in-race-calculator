# CarbsInRaceCalculator

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.14.

## Features

- **Race fuel calculator** — set race duration and carbohydrates per hour, then combine the built-in endurance products into a fuel plan.
- **Everyday nutrition calculator** — set a daily calorie target and body mass, then enter everyday food quantities in grams to track calories, carbohydrates, protein, fat, sugar, and fiber.

The everyday calculator uses a calorie goal range from 90% to 100% of the entered target. Protein is calculated at 2 g/kg of body mass, fat at 1 g/kg, and the remaining calories determine the carbohydrate range using 4 kcal/g for protein and carbohydrates and 9 kcal/g for fat. Food values are reference values per 100 g and can vary by product and preparation method.

## Application structure

```text
src/app/
├── features/
│   ├── daily-nutrition/
│   │   └── +state/daily-nutrition-state.ts
│   └── race-fuel/
│       └── +state/race-fuel-state.ts
├── services/
│   ├── product.model.ts
│   └── product.service.ts
└── shared/ui/
```

`ProductService` is the single catalog for race, daily, and shared products. Each feature state is scoped to its calculator component, keeps writable signals private, exposes computed state, and provides explicit methods for user actions such as changing settings, quantities, and resetting a plan.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

The unit suite uses [Vitest](https://vitest.dev/). Feature tests exercise rendered controls and
visible outcomes, while state and service tests cover domain calculations and external boundaries.

```bash
npm run test -- --watch=false
```

## Running end-to-end tests

The Playwright suite starts the Angular development server automatically and covers the main
calculator journeys in Chromium:

```bash
npx playwright install chromium
npm run test:e2e
```

The browser installation is only required once per Playwright version.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
