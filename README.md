This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

1. nextjs
2. shadcn -> It's a collection of beautifully designed, accessible, and customizable components that you can simply copy and paste into your apps.
3. clerkauth -> handle authentication. Protects route with provider. add env file.
4. lucide-react -> lots of icons to use
5. NeonDB
6. drizzleORM and drizzle-kit -> sync schema to neondb
7. 'use client'
8. react-dropzone
9. vectors and embeddings. cosine similarities to find the most similar vector to what's asked. embedding is the vector.
10. tanstack/react-query to handle data querying from local to server endpoints. React query can cache data and return. Create a provider and wrap app with it.
11. react-hot-toast
12. pinecone db
13. langchain
14. vercel ai sdk

pinecone terms

- index -> database to store vectors
- namespace -> table. segment pdf vector spaces

- obtain pdf
- split and segment pdf
- vectorise and embed individual documents
- store vectors into pineconedb

search

- embed query
- query pineconedb for similar vectors
- extract out the metadata of similar vectors
- feed metadata into openai prompt
-
