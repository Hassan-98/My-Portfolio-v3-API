import SKILL from './skills.model';
import STACK from '../Stack/stack.model';
//= Types
import { SkillMastery } from './skills.types';
import { StackType } from '../Stack/stack.types';

export default async function migrateSkills() {
  const skillsFound = await SKILL.count({});

  if (!skillsFound) {
    const stacks = await STACK.find({}).lean();

    await SKILL.create([
      {
        skill: stacks.find(stack => stack.name === "HTML")?._id,
        mastery: SkillMastery.Proficient,
        type: StackType.front,
        order: 1
      },
      {
        skill: stacks.find(stack => stack.name === "CSS")?._id,
        mastery: SkillMastery.Proficient,
        type: StackType.front,
        order: 2
      },
      {
        skill: stacks.find(stack => stack.name === "JavaScript")?._id,
        mastery: SkillMastery.Proficient,
        type: StackType.front,
        order: 3
      },
      {
        skill: stacks.find(stack => stack.name === "TypeScript")?._id,
        mastery: SkillMastery.Proficient,
        type: StackType.front,
        order: 4
      },
      {
        skill: stacks.find(stack => stack.name === "jQuery")?._id,
        mastery: SkillMastery.Proficient,
        type: StackType.front,
        order: 5
      },
      {
        skill: stacks.find(stack => stack.name === "Bootstrap")?._id,
        mastery: SkillMastery.Proficient,
        type: StackType.front,
        order: 6
      },
      {
        skill: stacks.find(stack => stack.name === "Sass")?._id,
        mastery: SkillMastery.Proficient,
        type: StackType.front,
        order: 7
      },
      {
        skill: stacks.find(stack => stack.name === "React")?._id,
        mastery: SkillMastery.Proficient,
        type: StackType.front,
        order: 8
      },
      {
        skill: stacks.find(stack => stack.name === "Redux")?._id,
        mastery: SkillMastery.Proficient,
        type: StackType.front,
        order: 9
      },
      {
        skill: stacks.find(stack => stack.name === "Next.js")?._id,
        mastery: SkillMastery.Proficient,
        type: StackType.front,
        order: 10
      },
      {
        skill: stacks.find(stack => stack.name === "Vue")?._id,
        mastery: SkillMastery.Proficient,
        type: StackType.front,
        order: 11
      },
      {
        skill: stacks.find(stack => stack.name === "Nuxt")?._id,
        mastery: SkillMastery.Proficient,
        type: StackType.front,
        order: 12
      },
      {
        skill: stacks.find(stack => stack.name === "Material UI")?._id,
        mastery: SkillMastery.Moderate,
        type: StackType.front,
        order: 13
      },
      {
        skill: stacks.find(stack => stack.name === "Gatsby")?._id,
        mastery: SkillMastery.Moderate,
        type: StackType.front,
        order: 14
      },
      {
        skill: stacks.find(stack => stack.name === "Jest")?._id,
        mastery: SkillMastery.Moderate,
        type: StackType.front,
        order: 15
      },
      {
        skill: stacks.find(stack => stack.name === "Node.js")?._id,
        mastery: SkillMastery.Proficient,
        type: StackType.back,
        order: 1
      },
      {
        skill: stacks.find(stack => stack.name === "Express")?._id,
        mastery: SkillMastery.Proficient,
        type: StackType.back,
        order: 2
      },
      {
        skill: stacks.find(stack => stack.name === "MongoDB")?._id,
        mastery: SkillMastery.Proficient,
        type: StackType.back,
        order: 3
      },
      {
        skill: stacks.find(stack => stack.name === "TypeScript")?._id,
        mastery: SkillMastery.Proficient,
        type: StackType.back,
        order: 4
      },
      {
        skill: stacks.find(stack => stack.name === "Prisma")?._id,
        mastery: SkillMastery.Moderate,
        type: StackType.back,
        order: 5
      },
      {
        skill: stacks.find(stack => stack.name === "Jest")?._id,
        mastery: SkillMastery.Moderate,
        type: StackType.back,
        order: 6
      },
      {
        skill: stacks.find(stack => stack.name === "PostgreSQL")?._id,
        mastery: SkillMastery.Moderate,
        type: StackType.back,
        order: 7
      },
      {
        skill: stacks.find(stack => stack.name === "Git")?._id,
        mastery: SkillMastery.Proficient,
        type: StackType.tools,
        order: 1
      },
      {
        skill: stacks.find(stack => stack.name === "Github")?._id,
        mastery: SkillMastery.Proficient,
        type: StackType.tools,
        order: 2
      },
      {
        skill: stacks.find(stack => stack.name === "NPM")?._id,
        mastery: SkillMastery.Proficient,
        type: StackType.tools,
        order: 3
      },
      {
        skill: stacks.find(stack => stack.name === "Yarn")?._id,
        mastery: SkillMastery.Proficient,
        type: StackType.tools,
        order: 4
      },
      {
        skill: stacks.find(stack => stack.name === "Vercel")?._id,
        mastery: SkillMastery.Proficient,
        type: StackType.tools,
        order: 5
      },
      {
        skill: stacks.find(stack => stack.name === "Netlify")?._id,
        mastery: SkillMastery.Moderate,
        type: StackType.tools,
        order: 6
      },
      {
        skill: stacks.find(stack => stack.name === "AWS")?._id,
        mastery: SkillMastery.Moderate,
        type: StackType.tools,
        order: 7
      }
    ]);
  }
};