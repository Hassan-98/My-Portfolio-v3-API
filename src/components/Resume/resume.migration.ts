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