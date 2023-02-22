import RESUME from './resume.model';

export default async function migrateResumePreferences() {
  const resumePreferencesCount = await RESUME.count({});

  if (resumePreferencesCount <= 0) {
    await RESUME.create({
      templates: [
        {
          name: "Minimal 1",
          image: "/images/minimal-cv.png"
        },
        {
          name: "Minimal 2",
          image: "/images/minimal-2-cv.png"
        }
      ],
      links: {
        showEmail: true,
        showPhone: true,
        showLinkedin: true,
        showGithub: true,
        showTwitter: false
      },
      summary: {
        showSection: true,
        showPicture: false,
        enableCustomSummary: true,
        customSummary: "I’m Hassan Ali, MERN Stack web developer from Egypt, Innovative Web Developer with over 1.5 years of experience inwebsite design and development. Demonstrated talent for front and back end web development to optimize onlinepresence. Expert in languages such as HTML, CSS, JavaScript and Node.js as well as React and Vue frameworks.",
        enableCustomTitle: false
      },
      skills: {
        showSection: true,
        showFrontendSkills: true,
        showBackendSkills: true,
        showToolsSkills: true,
        skillsPeriority: 'front'
      },
      experiences: {
        showSection: true,
        isLimited: true,
        limit: 3
      },
      education: {
        showSection: true,
        isLimited: true,
        limit: 3
      },
      projects: {
        showSection: true,
        isLimited: true,
        limit: 6
      }
    });
  }
};