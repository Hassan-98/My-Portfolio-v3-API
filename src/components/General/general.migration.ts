import GENERAL from './general.model';

export default async function migrateGeneralSettings() {
  const generalSettingsCount = await GENERAL.count({});
  if (generalSettingsCount <= 0) {
    await GENERAL.create({
      header: {
        jobTitle: "MERN Stack developer",
        descriptionText: "I'm a self-taught software engineer based on Egypt, with over 2 years experience specializing in MERN Stack web development.",
        pictureUrl: "/images/my-picture.png"
      },
      intro: {
        experienceYears: 2,
        jobTitle: "MERN Stack developer",
        aboutMe: `Hello! My name is Hassan, a self-taught software engineer based on Egypt, with +2 years experience as a professional Web developer, specializing in MERN Stack web development, Welcome to my corner of the internet. <BR>
        My interest in web development started back in 2018 when I decided to try to create my first personal website — turns out hacking together a custom website taught me a lot about HTML & CSS!`
      },
      links: {
        emailAddress: "7assan.3li1998@gmail.com",
        phoneNumber: "+201146321817",
        github: "https://github.com/Hassan-98",
        twitter: "https://twitter.com/aeae9992",
        linkedin: "https://www.linkedin.com/in/hassan1998"
      },
      recentStack: [
        {
          name: "Node.js",
          image: "nodejs.svg",
          type: "back",
          order: 1
        },
        {
          name: "MongoDB",
          image: "mongodb.svg",
          type: "back",
          order: 2
        },
        {
          name: "React",
          image: "react.svg",
          type: "front",
          order: 3
        },
        {
          name: "Vue",
          image: "vue.svg",
          type: "front",
          order: 4
        },
        {
          name: "TypeScript",
          image: "typescript.svg",
          type: "front back",
          order: 5
        }
      ]
    });
  }
};