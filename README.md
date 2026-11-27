# Yoga Fieldbook

Yoga Fieldbook is a visual study companion for introductory yoga teacher training. Explore illustrated poses and anatomy, revisit topics with short recall exercises, and rehearse teaching prompts. Progress stays in your browser and can be exported as a backup. The interface is available in English and Indonesian, with some lessons and quizzes still in English.

[Open Yoga Fieldbook](https://yoga-fieldbook.netlify.app)

![Illustration of Warrior II pose](public/assets/warrior-ii.webp)

The material supports independent study alongside teacher-led instruction. See the [asset register](content-review/asset-register.json) for artwork sources and attribution.

## Run locally

Use Node.js 24 and npm.

```sh
npm ci
npm run dev
```

## Verify the build

```sh
npm run check:content
npm run test:domain
npm run build
npm run test:sites
```

The static site is built into `dist/client`. When deploying it to a static host, configure navigation routes to fall back to `index.html`.
