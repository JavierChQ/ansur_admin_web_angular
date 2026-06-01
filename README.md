# AnsurAdminWebAngular

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.12.

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
npm run build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Environment variables

This project supports runtime configuration through a `.env` file in the repository root.

- Copy `.env.example` to `.env` and update the values for your environment.
- The `npm run prepare-env` step generates `public/env.js` before startup and build.

## Deploying to Railway

Railway uses the `Procfile` and the `PORT` environment variable to start the app.

1. Set the Railway build command to:

```bash
npm run build
```

2. Set the Railway start command to:

```bash
npm start
```

3. Configure these environment variables in Railway:

- `API_BASE_URL`
- `APP_TITLE`
- `ENVIRONMENT_NAME`

4. The project uses a `Procfile` with:

```text
web: npm start
```

5. Railway provides `PORT` automatically, and the app serves the static `dist/ansur_admin_web_angular` output using `serve`.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
