import STACK from './stack.model';
import { StackType } from './stack.types';

export default async function migrateStacks() {
  const stacksCount = await STACK.count({});
  if (stacksCount <= 0) {
    await STACK.create([
      {
        name: "AWS",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Famazon-aws.svg?alt=media&token=a1adae9d-742c-40fc-b599-90748d76618e",
        type: StackType.tools
      },
      {
        name: "Angular",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Fangular.svg?alt=media&token=2196e54b-28e3-4ae5-8b26-8d79f1c76fa5",
        type: StackType.front
      },
      {
        name: "Ant Design",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Fant-design.svg?alt=media&token=8484c824-6bbb-4f00-b3ce-835b32146dc4",
        isNotCompitable: true,
        type: StackType.front
      },
      {
        name: "Bootstrap",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Fbootstrap.svg?alt=media&token=e58db10c-f5b8-469e-85eb-1b11013de213",
        type: StackType.front
      },
      {
        name: "Chakra UI",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Fchakra-ui.svg?alt=media&token=2e81563f-f187-4dc6-b47c-5f54a10bc548",
        isNotCompitable: true,
        type: StackType.front
      },
      {
        name: "CSS",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Fcss.svg?alt=media&token=db281305-5fa9-4e6a-a96b-83d675fb6047",
        type: StackType.front
      },
      {
        name: "Digital Ocean",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Fdigital-ocean.svg?alt=media&token=bf7b5efe-7cbd-43c4-9e09-08f1ca92626d",
        type: StackType.tools
      },
      {
        name: "Django",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Fdjango.svg?alt=media&token=cd8cacb0-c46d-400f-a0cc-6252b6b04b5d",
        type: StackType.back
      },
      {
        name: "Docker",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Fdocker.svg?alt=media&token=55a1d591-157e-4c6c-9ae6-4405c0b0ed4f",
        type: StackType.tools
      },
      {
        name: "Dot Net",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Fdotnet.svg?alt=media&token=3b60c1aa-c1a4-4d63-8f5d-44f502c3ed1f",
        type: StackType.back
      },
      {
        name: "Electronjs",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Felectronjs.svg?alt=media&token=161b05e7-b43c-48bb-ae42-68ecd069b598",
        type: StackType.front
      },
      {
        name: "Elementor",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Felementor.svg?alt=media&token=22f36bcf-3f0a-46b6-9154-1aa3d4347d56",
        type: StackType.back
      },
      {
        name: "Express",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Fexpress.svg?alt=media&token=bcc8eecb-fa9c-4d6a-a6d4-9f03f8bab806",
        isNotCompitable: true,
        type: StackType.back
      },
      {
        name: "Figma",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Ffigma.svg?alt=media&token=ce7567c6-cece-42f3-9c40-eae17b041802",
        type: StackType.tools
      },
      {
        name: "Firebase",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Ffirebase.svg?alt=media&token=75af01b0-8a0b-4e42-a233-8f80c0281f7d",
        type: StackType.back
      },
      {
        name: "Gatsby",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Fgatsby.svg?alt=media&token=8b1015cd-f567-4a22-8dc3-f9e98a46a39a",
        type: StackType.front
      },
      {
        name: "Git",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Fgit.svg?alt=media&token=2c12cb98-dac9-484c-8222-effa031b659e",
        type: StackType.tools
      },
      {
        name: "Github",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Fgithub.svg?alt=media&token=44527251-dc7e-49c3-bbc8-3bd2013f769e",
        type: StackType.tools
      },
      {
        name: "GraphQL",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Fgraphql.svg?alt=media&token=b1140e11-79c0-4cc0-8ec5-5affa127b912",
        type: StackType.full
      },
      {
        name: "Gulp",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Fgulp.svg?alt=media&token=b9d37fb8-cf27-476e-9158-8cfa61002188",
        type: StackType.tools,
      },
      {
        name: "HTML",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Fhtml.svg?alt=media&token=41b6cb22-b0fc-4353-8cb0-9287feee5f49",
        type: StackType.front
      },
      {
        name: "JavaScript",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Fjavascript.svg?alt=media&token=ebc042aa-f2b9-469a-96f2-c039958a2ef2",
        type: StackType.front
      },
      {
        name: "Jest",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Fjest.svg?alt=media&token=fcd220b9-0c8a-431f-b40b-06fc8ec30f74",
        type: StackType.full
      },
      {
        name: "jQuery",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Fjquery.svg?alt=media&token=085a45d5-935c-4ed2-98a4-2ed1d483692f",
        type: StackType.front
      },
      {
        name: "Laravel",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Flaravel.svg?alt=media&token=f2eb438e-791c-403a-a81e-f6b5fd9f5f9e",
        type: StackType.back
      },
      {
        name: "Material UI",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Fmaterial-ui.svg?alt=media&token=5fc10ed1-0599-45b9-8107-550702e738ca",
        type: StackType.front,
        isNotCompitable: true
      },
      {
        name: "MongoDB",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Fmongodb.svg?alt=media&token=475b63d7-c33c-451a-90ed-c28ebeb3decb",
        type: StackType.back
      },
      {
        name: "MySQL",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Fmysql.svg?alt=media&token=55303af6-d829-4dda-94ed-7d0a21e3a3ca",
        type: StackType.back
      },
      {
        name: "Nestjs",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Fnestjs.svg?alt=media&token=2c916e08-d3f3-4e17-9dac-adab2c6f0776",
        isNotCompitable: true,
        type: StackType.back
      },
      {
        name: "Netlify",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Fnetlify.svg?alt=media&token=209041b9-ccdc-44c7-9e66-f24a2aebf2ae",
        type: StackType.tools
      },
      {
        name: "Next.js",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Fnext.svg?alt=media&token=8a5f72ae-e39d-454b-b5bc-c2c48810077f",
        type: StackType.front
      },
      {
        name: "Node.js",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Fnodejs.svg?alt=media&token=8f287f78-fd7a-478b-813b-172399acc7da",
        type: StackType.back
      },
      {
        name: "NPM",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Fnpm.svg?alt=media&token=a683b46b-7fef-4bb0-a1ee-de965a9b35e4",
        type: StackType.tools
      },
      {
        name: "Nuxt",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Fnuxt.svg?alt=media&token=154a9811-2964-4c04-b064-50507bb315f8",
        type: StackType.front
      },
      {
        name: "Php",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Fphp.svg?alt=media&token=03118348-6f5c-49bd-9899-45ac3771601f",
        type: StackType.back
      },
      {
        name: "PostgreSQL",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Fpostgresql.svg?alt=media&token=ad8ae82c-de81-4eae-931e-3a3863355119",
        type: StackType.back
      },
      {
        name: "Postman",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Fpostman.svg?alt=media&token=279d6ad7-79e7-4e16-a889-d201ebdafe70",
        type: StackType.tools
      },
      {
        name: "Prisma",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Fprisma.svg?alt=media&token=be23f5d2-fd3e-4bcc-a8ba-d35fd952ab9d",
        isNotCompitable: true,
        type: StackType.back
      },
      {
        name: "Python",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Fpython.svg?alt=media&token=dc4655c9-732d-4a12-b40f-9f7f5e1ac8ad",
        type: StackType.back
      },
      {
        name: "React",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Freact.svg?alt=media&token=ae8689ca-64b9-4b56-9bbf-c178727d6e42",
        type: StackType.front
      },
      {
        name: "React Native",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Freact-native.svg?alt=media&token=6931d074-59e0-4d7d-ae17-d4d4c574759a",
        isNotCompitable: true,
        type: StackType.front
      },
      {
        name: "Redis",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Fredis.svg?alt=media&token=2319167e-7632-4622-b4e7-ee22eb9d006a",
        type: StackType.back
      },
      {
        name: "Redux",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Fredux.svg?alt=media&token=f0a5b6e4-b18b-439b-af7e-faf9d6567560",
        type: StackType.front
      },
      {
        name: "Sass",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Fsass.svg?alt=media&token=944f01b2-34a3-4b3d-97a5-1a44d0529045",
        type: StackType.front
      },
      {
        name: "Sequelize",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Fsequelize.svg?alt=media&token=e8b31f23-8efe-4ccf-a0e8-e83c558fa873",
        isNotCompitable: true,
        type: StackType.back
      },
      {
        name: "Shopify",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Fshopify.svg?alt=media&token=2cb90837-d055-414f-a75e-0290424179fe",
        type: StackType.back
      },
      {
        name: "Socket IO",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Fsocket.svg?alt=media&token=e01317cd-7393-47e7-ad4b-e691f608bcba",
        isNotCompitable: true,
        type: StackType.back
      },
      {
        name: "Tailwindcss",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Ftailwindcss.svg?alt=media&token=8e4a1415-8f36-42c0-bd34-ba78d6deb99e",
        isNotCompitable: true,
        type: StackType.front
      },
      {
        name: "TypeScript",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Ftypescript.svg?alt=media&token=20bbce10-10dd-409a-8921-5fbb6c14f391",
        type: StackType.full
      },
      {
        name: "Vercel",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Fvercel.svg?alt=media&token=336c339d-b09a-4aef-a9b5-aeb20879681d",
        isNotCompitable: true,
        type: StackType.tools
      },
      {
        name: "VSCode",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Fvscode.svg?alt=media&token=351eaa89-02af-42ec-8e98-1e2e0fea8b2b",
        type: StackType.tools
      },
      {
        name: "Vue",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Fvue.svg?alt=media&token=00e2949d-8fa6-4512-be3a-ab92804ab657",
        type: StackType.front
      },
      {
        name: "Webpack",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Fwebpack.svg?alt=media&token=273b1d58-c099-41e9-b5da-4ecaf53a85d9",
        type: StackType.tools
      },
      {
        name: "Yarn",
        image: "https://firebasestorage.googleapis.com/v0/b/portfolio-storage-63979.appspot.com/o/stack-logos%2Fyarn.svg?alt=media&token=582b0a00-a67b-48c0-8593-6f61bc23f571",
        type: StackType.tools
      }
    ]);
  }
};