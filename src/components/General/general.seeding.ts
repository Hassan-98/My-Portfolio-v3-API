import GENERAL from './general.model';
import STACK from '../Stack/stack.model';

export default async function migrateGeneralSettings() {
  const generalSettingsCount = await GENERAL.count({});

  if (generalSettingsCount <= 0) {
    const stacks = await STACK.find({
      name: { $in: ['Node.js', 'MongoDB', 'React', 'Vue', 'TypeScript'] }
    }).lean();

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
          stack: stacks.find(stack => stack.name === "Node.js")?._id,
          order: 1
        },
        {
          stack: stacks.find(stack => stack.name === "MongoDB")?._id,
          order: 2
        },
        {
          stack: stacks.find(stack => stack.name === "React")?._id,
          order: 3
        },
        {
          stack: stacks.find(stack => stack.name === "Vue")?._id,
          order: 4
        },
        {
          stack: stacks.find(stack => stack.name === "TypeScript")?._id,
          order: 5
        }
      ]
    });
  }
};