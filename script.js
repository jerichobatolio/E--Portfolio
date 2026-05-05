const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");
const dropdownToggles = document.querySelectorAll(".dropdown-toggle");
const tabButtons = document.querySelectorAll(".section-tabs .tab-btn");
const toggleButtons = document.querySelectorAll("[data-toggle-target]");
const contentsTrigger = document.querySelector("[data-contents-trigger]");
const chaptersTrigger = document.querySelector("[data-chapters-trigger]");
const appendicesTrigger = document.querySelector("[data-appendices-trigger]");
const gatedContentSections = document.querySelectorAll(".content-gated");
const homeLink = document.querySelector('.nav-links a[href="#title-page"]');
const logoLink = document.querySelector('.logo[href="#title-page"]');

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  navItems.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
    });
  });
}

const sections = [...document.querySelectorAll("main section[id]")];

const updateActiveNav = () => {
  let currentId = sections[0]?.id;

  sections.forEach((section) => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) {
      currentId = section.id;
    }
  });

  navItems.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${currentId}`;
    link.classList.toggle("active", isActive);
  });

  dropdownToggles.forEach((toggle) => {
    const parentItem = toggle.closest(".has-dropdown");
    const childLinks = parentItem?.querySelectorAll("a") ?? [];
    const hasActiveChild = [...childLinks].some((link) => link.classList.contains("active"));
    toggle.classList.toggle("active", hasActiveChild);
  });
};

const activatePanelById = (targetId) => {
  const tabButton = document.querySelector(`.tab-btn[data-tab-target="${targetId}"]`);
  if (!tabButton) {
    return;
  }
  tabButton.click();
};

const viewGroups = {
  home: ["title-page"],
  contents: ["toc", "personal"],
  chapters: ["sections"],
  appendices: ["gallery"],
};

const allViewSectionIds = [...new Set(Object.values(viewGroups).flat())];

const setView = (viewName) => {
  const visibleIds = new Set(viewGroups[viewName] || viewGroups.home);
  allViewSectionIds.forEach((id) => {
    const section = document.getElementById(id);
    if (!section) {
      return;
    }
    section.classList.toggle("is-hidden", !visibleIds.has(id));
  });
};

const resolveViewByTarget = (targetId) => {
  if (targetId === "title-page") {
    return "home";
  }

  if (["toc", "acknowledgment", "prayer", "philosophy", "career-plan"].includes(targetId)) {
    return "contents";
  }

  if (["chapter1", "chapter2", "chapter3", "chapter4"].includes(targetId)) {
    return "chapters";
  }

  if (
    [
      "gallery", "appendix-a", "appendix-b", "appendix-c", "appendix-d", "appendix-e",
      "appendix-f", "appendix-g", "appendix-h", "appendix-j", "appendix-k", "appendix-l",
      "appendix-m", "appendix-n", "appendix-o", "appendix-p", "appendix-q", "appendix-r",
    ].includes(targetId)
  ) {
    return "appendices";
  }

  return null;
};

window.addEventListener("scroll", updateActiveNav);
window.addEventListener("load", updateActiveNav);

navItems.forEach((link) => {
  link.addEventListener("click", () => {
    const href = link.getAttribute("href") || "";
    if (!href.startsWith("#")) {
      return;
    }
    const targetId = href.slice(1);
    const targetView = resolveViewByTarget(targetId);
    if (targetView) {
      setView(targetView);
    }
    activatePanelById(targetId);
  });
});

if (contentsTrigger) {
  contentsTrigger.addEventListener("click", () => {
    setView("contents");
    const tocSection = document.querySelector("#toc");
    tocSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

if (chaptersTrigger) {
  chaptersTrigger.addEventListener("click", () => {
    setView("chapters");
    const sectionsBlock = document.querySelector("#sections");
    sectionsBlock?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

if (appendicesTrigger) {
  appendicesTrigger.addEventListener("click", () => {
    setView("appendices");
    const gallerySection = document.querySelector("#gallery");
    gallerySection?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

if (homeLink) {
  homeLink.addEventListener("click", () => {
    setView("home");
  });
}

if (logoLink) {
  logoLink.addEventListener("click", () => {
    setView("home");
  });
}

const revealTargets = document.querySelectorAll(".section, .profile-card, .content-card, .contact-item");

const revealOnScroll = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("reveal");
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.15,
    rootMargin: "0px 0px -30px 0px",
  }
);

revealTargets.forEach((target) => {
  revealOnScroll.observe(target);
});

const gallery = document.querySelector("#image-gallery");
const appendixTabs = document.querySelector("#appendix-tabs");

if (gallery) {
  const resolveAppendixDocumentBaseHref = () => {
    const url = new URL(window.location.href);
    url.hash = "";
    let path = url.pathname;
    const lastSegment = path.split("/").pop() || "";
    const lastLooksLikeFile = /\.[a-z0-9]{2,5}$/i.test(lastSegment);
    if (!path.endsWith("/")) {
      if (lastLooksLikeFile) {
        path = path.replace(/\/[^/]+$/, "/");
      } else {
        path = `${path}/`;
      }
    }
    url.pathname = path;
    return url.href;
  };

  const appendixAssetBase = resolveAppendixDocumentBaseHref();
  const absoluteAssetUrl = (relativePath) =>
    new URL(String(relativePath).replace(/^\//, ""), appendixAssetBase).href;

  const appendixResolveSrc = (ref) => {
    if (/^(?:https?:|file:|data:)/i.test(ref)) {
      return ref;
    }
    const path = ref.includes("/") ? ref : `assets/images/${ref}`;
    return absoluteAssetUrl(path);
  };

  const appendixImageMap = [
    {
      appendix: "Appendix A",
      title: "Evaluation Form (Registrar's Office)",
      files: [
        "assets/images/export/image-0c81d4d8-6d9d-4f14-be20-e46a86a8730e.png",
        "assets/images/export/image-6edf06c9-a0ba-42f4-b9a4-e283f9994687.png",
      ],
    },
    { appendix: "Appendix B", title: "Photocopy of Registration Form", files: ["image25.png"] },
    { appendix: "Appendix C", title: "Photocopy of Validated ID", files: ["image26.jpeg", "image27.jpeg"] },
    { appendix: "Appendix D", title: "Parent's Consent", files: ["image28.png"] },
    {
      appendix: "Appendix E",
      title: "Medical Certificate",
      files: [
        "image29.png",
        "assets/images/export/image-7af1e454-128b-42c3-8ccf-f237f9a1ddb9.png",
      ],
    },
    { appendix: "Appendix F", title: "Certificate of Good Moral Character", files: [] },
    {
      appendix: "Appendix G",
      title: "Application Letter",
      contentType: "letter",
      signatureImage: "assets/images/export/image-fdbe5550-f213-423b-aed1-cf43cc6d0dd6.png",
      letterData: {
        heading: "Application Letter",
        date: "January 26, 2026",
        recipient: ["MS. MARITES D. ESCULTOR", "Program Chair, BSIT", "OMSC - San Jose Campus"],
        salutation: "Dear Ma'am,",
        body: [
          "Greetings of peace!",
          "I am writing to formally express my interest in applying for an On-the-Job Training (OJT) position in the Office of the Scholarship Program. I am currently a fourth-year student taking up Bachelor of Science in Information Technology at Occidental Mindoro State College - San Jose Campus.",
          "As a student who is eager to support both my academic journey and personal development, I believe that undergoing my On-the-Job Training in your office will allow me to gain valuable hands-on experience, further enhance my skills, and contribute meaningfully to the institution. I am confident in my ability to perform clerical tasks, handle documents, and assist with basic office functions in a responsible and professional manner.",
          "I sincerely hope for your kind consideration of my application. Thank you very much for your time and attention, and I look forward to the opportunity to contribute to your office."
        ],
        closing: "Respectfully yours,",
        name: "JERICHO C. BATOLIO",
        role: "Student-Applicant"
      }
    },
    {
      appendix: "Appendix H",
      title: "Endorsement Letter",
      files: [
        "assets/images/export/image-4efe9cc5-e58d-4deb-8b1f-4884c09dbcb7.png",
      ],
    },
    { appendix: "Appendix J", title: "Daily Time Record (Time Card)", files: [] },
    {
      appendix: "Appendix K",
      title: "Certificate of Completion (Placement Agency/Office)",
      files: [
        "assets/images/export/image-b49ee60b-9dcf-4c54-9f46-a377e9f6676e.png",
      ],
    },
    {
      appendix: "Appendix L",
      title: "Certificate of Clearance (Placement Agency/Office)",
      files: [
        "assets/images/export/image-51e0f87e-b1b3-47ad-8daf-ea3d5abd56d4.png",
      ],
    },
    {
      appendix: "Appendix M",
      title: "Performance/Proficiency Rating Sheet (Placement Agency/Office)",
      files: [
        "assets/images/export/image-4a16b77c-6cee-44ca-a6fd-31672824bd95.png",
        "assets/images/export/image-b73e1b9b-532e-4200-9cf4-ceb93f7a7177.png",
        "assets/images/export/image-aeb05d22-efe3-42e8-85a9-f67d0e9d2443.png",
      ],
    },
    {
      appendix: "Appendix N",
      title: "Pictures during Pre-service Seminar",
      files: [
        "image42.png",
        "image43.png",
        "image44.jpeg",
        "image45.jpeg",
        "image46.jpeg",
        "image47.jpeg",
        "image48.jpeg",
        "image49.jpeg",
      ],
    },
    {
      appendix: "Appendix O",
      title: "Pictures during Office Works",
      files: [
        "assets/images/export/image-e6015628-c2b5-4b78-a44a-6c1a7674e312.png",
        "image51.jpeg",
        "image52.jpeg",
        "image53.jpeg",
        "image54.jpeg",
        "image55.jpeg",
        "image56.jpeg",
        "image57.jpeg",
        "image58.jpeg",
      ],
    },
    {
      appendix: "Appendix P",
      title: "Code of Ethics for CAST Student Internship",
      contentType: "text",
      textSections: [
        {
          heading: "Preamble",
          paragraph: "I will use my special knowledge for the benefit of the public. I will serve employees and clients with integrity, subject to an overriding responsibility to the public interest, and I will strive to enhance the competence and prestige of the profession. By these means:",
          listType: "ordered",
          list: [
            "I will promote public knowledge, understanding, and appreciation of information technology.",
            "I will consider the general welfare and public good in the performance of my work.",
            "I will advertise goods or professional services in a clear and truthful manner.",
            "I will comply and strictly abide by the intellectual property laws, patent laws, and other related laws on respect of information technology.",
            "I will accept full responsibility for the work undertaken and utilize skills with competence and professionalism.",
            "I will make truthful statements on my areas of competence as well as the capabilities and qualities of my products or services.",
            "I will not disclose any confidential information obtained in the course of professional duties without the consent of the parties concerned, except when required by law.",
            "I will try to attain the highest quality in both the products and services that I offer.",
            "I will not knowingly participate in the development of information technology systems that promote the commission of fraud and other unlawful acts.",
            "I will uphold and improve the IT profession standard through continuing professional development in order to enhance IT professionals."
          ]
        }
      ]
    },
    {
      appendix: "Appendix Q",
      title: "Curriculum Vitae",
      contentType: "cv",
      photo: "image59.png",
      signatureImage: "assets/images/export/image-fdbe5550-f213-423b-aed1-cf43cc6d0dd6.png",
      cvData: {
        name: "JERICHO C. BATOLIO",
        address: "Concepcion Calintaan, Occidental Mindoro",
        email: "jerichobatolio@gmail.com",
        phone: "09532956095",
        objective: "To obtain a challenging position where I can effectively utilize my skills, education, and strong people-oriented abilities to contribute to the success of the organization and advance my career.",
        education: [
          {
            level: "Tertiary:",
            school: "Occidental Mindoro State College",
            details: "Undergraduate Bachelor of Science in Information Technology",
            period: "(2022-present)"
          },
          {
            level: "Secondary:",
            school: "Concepcion National High School",
            details: "",
            period: "(2020-2021)"
          },
          {
            level: "Primary:",
            school: "Concepcion Elementary School",
            details: "",
            period: "(2010-2016)"
          }
        ],
        trainings: ["Title of Training/Seminars", "Sponsoring Agency", "Inclusive Dates"],
        skills: [
          "Proficient in Office Productivity Tools (Microsoft Word, Excel, PowerPoint)",
          "Proficient in Multimedia Tools (Adobe Photoshop, Power Director)",
          "Average in Programming (C++, VB10, HTML)"
        ],
        personalData: [
          "Age: 21",
          "Sex: Male",
          "Date of Birth: June 03, 2004",
          "Place of Birth: Concepcion Calintaan Occidental Mindoro",
          "Civil Status: Single",
          "Height: 174",
          "Weight: 79",
          "Religion: Roman Catholic",
          "Father's Name: Melchor Batolio",
          "Mother's Name: Raquel Batolio"
        ],
        characterReferences: [
          "Name:",
          "Position:",
          "Company:",
          "Contact No.:",
          "Name:",
          "Position:",
          "Company:",
          "Contact No.:"
        ],
        certification: "I hereby certify that all the above information is true and correct to the best of my knowledge and beliefs."
        ,
        declarationName: "JERICHO C. BATOLIO",
        declarationRole: "Signature over Printed Name"
      }
    },
    {
      appendix: "Appendix R",
      title: "On-the-Job Training Portfolio Evaluation Form",
      contentType: "evaluationForm",
      formData: {
        studentName: "Batolio, Jericho C.",
        course: "BSIT 4C",
        agency: "Multimedia, San Jose Campus",
        periodCovered: "January - April",
        address: "",
        criteriaRows: [
          { criteria: "1. Quality of Content (60%)", percent: "", rating: "" },
          { criteria: "    Grammar", percent: "", rating: "" },
          { criteria: "    Organization", percent: "", rating: "" },
          { criteria: "2. Quality of format (40%)", percent: "", rating: "" },
          { criteria: "    Spacing", percent: "", rating: "" },
          { criteria: "    Margins", percent: "", rating: "" },
          { criteria: "    Heading", percent: "", rating: "" },
          { criteria: "    Typeset & Paging", percent: "", rating: "" },
          { criteria: "    Tables and Pictures", percent: "", rating: "" },
          { criteria: "General Average", percent: "100%", rating: "" }
        ]
      }
    },
  ];

  const openAppendixInNewTab = (panelElement, group) => {
    const newTab = window.open("", "_blank");
    if (!newTab) {
      return;
    }

    const panelHtml = panelElement.innerHTML;
    const subtitle = group?.title || "Appendix Document";

    newTab.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <base href="${appendixAssetBase}">
        <title>${group?.appendix || "Appendix"} - ${subtitle}</title>
        <link rel="stylesheet" href="${absoluteAssetUrl("styles.css")}">
        <style>
          body {
            margin: 0;
            min-height: 100vh;
            padding: 1.25rem;
            background:
              radial-gradient(circle at 8% 10%, rgba(94, 234, 212, 0.1), transparent 35%),
              radial-gradient(circle at 88% 12%, rgba(139, 92, 246, 0.14), transparent 34%),
              #070d1d;
          }
          .appendix-group {
            display: block !important;
            max-width: 860px;
            margin: 0 auto;
            border-radius: 16px;
            padding: 1.1rem;
            background: linear-gradient(145deg, rgba(24, 37, 74, 0.95), rgba(12, 21, 48, 0.95));
            border: 1px solid rgba(94, 234, 212, 0.25);
          }
          .appendix-detail-head {
            margin-bottom: 1.05rem;
            border-bottom: 1px solid rgba(94, 234, 212, 0.2);
            padding-bottom: 0.75rem;
          }
          .appendix-back-btn {
            background: rgba(10, 20, 48, 0.9);
            border-color: rgba(94, 234, 212, 0.35);
          }
          .appendix-images {
            grid-template-columns: repeat(auto-fit, minmax(260px, 340px));
            justify-content: center;
            gap: 0.85rem;
            max-width: 740px;
            margin: 0 auto;
          }
          .gallery-item {
            min-height: 340px;
            border-radius: 12px;
            border: 1px solid rgba(94, 234, 212, 0.2);
            background: rgba(8, 15, 35, 0.75);
          }
          .gallery-item img {
            object-fit: contain;
            padding: 0.4rem;
          }
          .letter-signature img,
          .cv-signature img {
            max-width: 220px;
            height: auto;
            background: #fff;
            padding: 6px;
            border-radius: 6px;
            box-sizing: border-box;
          }
          @media (max-width: 760px) {
            body { padding: 0.7rem; }
            .appendix-images {
              grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
            }
            .gallery-item { min-height: 250px; }
          }
        </style>
      </head>
      <body>
        <main>
          <section class="appendix-group active">
            ${panelHtml}
          </section>
        </main>
        <script>
          (function () {
            const backBtn = document.querySelector(".appendix-back-btn");
            if (!backBtn) return;
            backBtn.addEventListener("click", function () {
              try {
                if (window.opener && !window.opener.closed) {
                  window.opener.focus();
                  const gallerySection = window.opener.document.querySelector("#gallery");
                  if (gallerySection) {
                    gallerySection.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }
              } catch (err) {}
              window.close();
            });
          })();
        </script>
      </body>
      </html>
    `);
    newTab.document.close();
  };

  const appendixGroupById = new Map();

  const showAppendixTiles = () => {
    if (appendixTabs) {
      appendixTabs.classList.remove("is-hidden");
    }
    const appendixPanels = gallery.querySelectorAll("[data-appendix-panel]");
    appendixPanels.forEach((panel) => panel.classList.remove("active"));
    const appendixTabButtons = appendixTabs?.querySelectorAll(".tab-btn") ?? [];
    appendixTabButtons.forEach((btn) => btn.classList.remove("active"));
  };

  appendixImageMap.forEach((group) => {
    const section = document.createElement("section");
    section.className = "appendix-group";
    section.id = group.appendix.toLowerCase().replace(/\s+/g, "-");
    section.dataset.appendixPanel = "true";
    section.dataset.appendix = group.appendix;
    appendixGroupById.set(section.id, group);

    const head = document.createElement("div");
    head.className = "appendix-detail-head";
    const backBtn = document.createElement("button");
    backBtn.type = "button";
    backBtn.className = "appendix-back-btn";
    backBtn.textContent = "Back to Appendices";
    backBtn.addEventListener("click", () => {
      showAppendixTiles();
      const gallerySection = document.querySelector("#gallery");
      gallerySection?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    head.appendChild(backBtn);

    const headTitle = document.createElement("div");
    headTitle.className = "appendix-detail-title";
    const appendixLetter = (group.appendix || "").replace("Appendix", "").trim();

    const letterBadge = document.createElement("span");
    letterBadge.className = "appendix-detail-letter";
    letterBadge.textContent = appendixLetter;
    headTitle.appendChild(letterBadge);

    const titleTextWrap = document.createElement("span");
    titleTextWrap.className = "appendix-detail-text";
    const titleMain = document.createElement("span");
    titleMain.className = "appendix-detail-main";
    titleMain.textContent = group.appendix;
    const titleSub = document.createElement("span");
    titleSub.className = "appendix-detail-sub";
    titleSub.textContent = group.title || "Appendix Document";
    titleTextWrap.appendChild(titleMain);
    titleTextWrap.appendChild(titleSub);
    headTitle.appendChild(titleTextWrap);

    head.appendChild(headTitle);
    section.appendChild(head);

    if (group.contentType === "letter") {
      section.classList.add("appendix-letter-group");
      const paper = document.createElement("article");
      paper.className = "letter-paper";

      const heading = document.createElement("h3");
      heading.className = "letter-title";
      heading.textContent = group.letterData?.heading || group.title || "Application Letter";
      paper.appendChild(heading);

      const date = document.createElement("p");
      date.className = "letter-date";
      date.textContent = group.letterData?.date || "";
      paper.appendChild(date);

      const recipient = document.createElement("div");
      recipient.className = "letter-recipient";
      (group.letterData?.recipient || []).forEach((line) => {
        const p = document.createElement("p");
        p.textContent = line;
        recipient.appendChild(p);
      });
      paper.appendChild(recipient);

      const salutation = document.createElement("p");
      salutation.className = "letter-salutation";
      salutation.textContent = group.letterData?.salutation || "";
      paper.appendChild(salutation);

      const bodyWrap = document.createElement("div");
      bodyWrap.className = "letter-body";
      (group.letterData?.body || []).forEach((paragraphText) => {
        const p = document.createElement("p");
        p.textContent = paragraphText;
        bodyWrap.appendChild(p);
      });
      paper.appendChild(bodyWrap);

      const closing = document.createElement("p");
      closing.className = "letter-closing";
      closing.textContent = group.letterData?.closing || "";
      paper.appendChild(closing);

      if (group.signatureImage) {
        const signatureWrap = document.createElement("figure");
        signatureWrap.className = "letter-signature";
        const signature = document.createElement("img");
        signature.src = appendixResolveSrc(group.signatureImage);
        signature.alt = "Signature";
        signature.loading = "lazy";
        signature.decoding = "async";
        signatureWrap.appendChild(signature);
        paper.appendChild(signatureWrap);
      }

      const name = document.createElement("p");
      name.className = "letter-name";
      name.textContent = group.letterData?.name || "";
      paper.appendChild(name);

      const role = document.createElement("p");
      role.className = "letter-role";
      role.textContent = group.letterData?.role || "";
      paper.appendChild(role);

      section.appendChild(paper);
    } else if (group.contentType === "cv") {
      section.classList.add("appendix-cv-group");
      const paper = document.createElement("article");
      paper.className = "cv-paper";

      const cvTitle = document.createElement("h3");
      cvTitle.className = "cv-title";
      cvTitle.textContent = `${group.appendix}:`;
      paper.appendChild(cvTitle);

      const cvSubtitle = document.createElement("h4");
      cvSubtitle.className = "cv-subtitle";
      cvSubtitle.textContent = group.title || "Curriculum Vitae";
      paper.appendChild(cvSubtitle);

      const hero = document.createElement("section");
      hero.className = "cv-hero";

      const info = document.createElement("div");
      info.className = "cv-contact";
      const cvName = document.createElement("p");
      cvName.className = "cv-name";
      cvName.textContent = group.cvData?.name || "";
      info.appendChild(cvName);

      ["address", "email", "phone"].forEach((key) => {
        const p = document.createElement("p");
        p.textContent = group.cvData?.[key] || "";
        info.appendChild(p);
      });
      hero.appendChild(info);

      if (group.photo) {
        const photoWrap = document.createElement("figure");
        photoWrap.className = "cv-photo";
        const photo = document.createElement("img");
        photo.src = appendixResolveSrc(`assets/images/${group.photo}`);
        photo.alt = "Curriculum Vitae photo";
        photo.loading = "lazy";
        photo.decoding = "async";
        photoWrap.appendChild(photo);
        hero.appendChild(photoWrap);
      }

      paper.appendChild(hero);

      const addCvSection = (headingText, builder) => {
        const sectionWrap = document.createElement("section");
        sectionWrap.className = "cv-section";
        const heading = document.createElement("h5");
        heading.textContent = headingText;
        sectionWrap.appendChild(heading);
        builder(sectionWrap);
        paper.appendChild(sectionWrap);
      };

      addCvSection("OBJECTIVES", (sectionWrap) => {
        const p = document.createElement("p");
        p.textContent = group.cvData?.objective || "";
        sectionWrap.appendChild(p);
      });

      addCvSection("EDUCATIONAL BACKGROUND", (sectionWrap) => {
        const educationList = document.createElement("div");
        educationList.className = "cv-education-list";
        (group.cvData?.education || []).forEach((item) => {
          const row = document.createElement("div");
          row.className = "cv-education-row";
          row.innerHTML = `
            <p class="cv-education-level">${item.level || ""}</p>
            <div class="cv-education-main">
              <p class="cv-education-school">${item.school || ""}</p>
              ${item.details ? `<p>${item.details}</p>` : ""}
              <p>${item.period || ""}</p>
            </div>
          `;
          educationList.appendChild(row);
        });
        sectionWrap.appendChild(educationList);
      });

      addCvSection("TRAINING AND SEMINARS ATTENDED", (sectionWrap) => {
        const list = document.createElement("div");
        list.className = "cv-simple-lines";
        (group.cvData?.trainings || []).forEach((item) => {
          const p = document.createElement("p");
          p.textContent = item;
          list.appendChild(p);
        });
        sectionWrap.appendChild(list);
      });

      addCvSection("SKILLS AND INTEREST", (sectionWrap) => {
        const list = document.createElement("div");
        list.className = "cv-simple-lines";
        (group.cvData?.skills || []).forEach((item) => {
          const p = document.createElement("p");
          p.textContent = item;
          list.appendChild(p);
        });
        sectionWrap.appendChild(list);
      });

      addCvSection("PERSONAL DATA", (sectionWrap) => {
        const list = document.createElement("div");
        list.className = "cv-simple-lines";
        (group.cvData?.personalData || []).forEach((item) => {
          const p = document.createElement("p");
          p.textContent = item;
          list.appendChild(p);
        });
        sectionWrap.appendChild(list);
      });

      addCvSection("CHARACTER REFERENCES", (sectionWrap) => {
        const list = document.createElement("div");
        list.className = "cv-simple-lines";
        (group.cvData?.characterReferences || []).forEach((item) => {
          const p = document.createElement("p");
          p.textContent = item;
          list.appendChild(p);
        });
        sectionWrap.appendChild(list);
      });

      const cert = document.createElement("p");
      cert.className = "cv-certification";
      cert.textContent = group.cvData?.certification || "";
      paper.appendChild(cert);

      if (group.signatureImage) {
        const signatureWrap = document.createElement("figure");
        signatureWrap.className = "cv-signature";
        const signature = document.createElement("img");
        signature.src = appendixResolveSrc(group.signatureImage);
        signature.alt = "Signature";
        signature.loading = "lazy";
        signature.decoding = "async";
        signatureWrap.appendChild(signature);
        paper.appendChild(signatureWrap);
      }

      const certName = document.createElement("p");
      certName.className = "cv-cert-name";
      certName.textContent = group.cvData?.declarationName || "";
      paper.appendChild(certName);

      const certRole = document.createElement("p");
      certRole.className = "cv-cert-role";
      certRole.textContent = group.cvData?.declarationRole || "";
      paper.appendChild(certRole);

      section.appendChild(paper);
    } else if (group.contentType === "evaluationForm") {
      const paper = document.createElement("article");
      paper.className = "eval-paper";

      const title = document.createElement("h3");
      title.className = "eval-title";
      title.textContent = `${group.appendix}:`;
      paper.appendChild(title);

      const subtitle = document.createElement("h4");
      subtitle.className = "eval-subtitle";
      subtitle.textContent = group.title || "Evaluation Form";
      paper.appendChild(subtitle);

      const details = document.createElement("div");
      details.className = "eval-details";
      details.innerHTML = `
        <p><strong>Name of Student:</strong> ${group.formData?.studentName || ""}</p>
        <p><strong>Course:</strong> ${group.formData?.course || ""}</p>
        <p><strong>Name of Agency:</strong> ${group.formData?.agency || ""}</p>
        <p><strong>Period Covered:</strong> ${group.formData?.periodCovered || ""}</p>
        <p><strong>Address:</strong> ${group.formData?.address || ""}</p>
      `;
      paper.appendChild(details);

      const tableWrap = document.createElement("div");
      tableWrap.className = "chapter3-table-wrap";
      const table = document.createElement("table");
      table.className = "report-table eval-report-table";
      table.innerHTML = `
        <thead>
          <tr>
            <th>CRITERIA</th>
            <th>PERCENT</th>
            <th>RATING</th>
          </tr>
        </thead>
      `;
      const tbody = document.createElement("tbody");
      (group.formData?.criteriaRows || []).forEach((row) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${row.criteria || ""}</td>
          <td>${row.percent || ""}</td>
          <td>${row.rating || ""}</td>
        `;
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      tableWrap.appendChild(table);
      paper.appendChild(tableWrap);
      section.appendChild(paper);
    } else if (group.contentType === "text") {
      const textWrap = document.createElement("div");
      textWrap.className = "appendix-text";

      if (group.headerImage) {
        textWrap.classList.add("appendix-text-with-image");
        const textImage = document.createElement("figure");
        textImage.className = "appendix-text-image";

        const img = document.createElement("img");
        img.src = appendixResolveSrc(`assets/images/${group.headerImage}`);
        img.alt = `${group.appendix} featured image`;
        img.loading = "lazy";
        img.decoding = "async";

        textImage.appendChild(img);
        textWrap.appendChild(textImage);
      }

      (group.textSections || []).forEach((textSection) => {
        const block = document.createElement("article");
        block.className = "appendix-text-block";

        if (textSection.heading) {
          const heading = document.createElement("h4");
          heading.textContent = textSection.heading;
          block.appendChild(heading);
        }

        if (textSection.paragraph) {
          const paragraph = document.createElement("p");
          paragraph.textContent = textSection.paragraph;
          block.appendChild(paragraph);
        }

        if (Array.isArray(textSection.list) && textSection.list.length) {
          const listType = textSection.listType || "ordered";
          const list = document.createElement(listType === "ordered" ? "ol" : "ul");
          if (listType === "plain") {
            list.classList.add("list-plain");
          }
          textSection.list.forEach((item) => {
            const li = document.createElement("li");
            li.textContent = item;
            list.appendChild(li);
          });
          block.appendChild(list);
        }

        textWrap.appendChild(block);
      });

      section.appendChild(textWrap);
    } else {
      const imageGrid = document.createElement("div");
      imageGrid.className = "appendix-images";

      const blockedInAppendixN = new Set([
        "assets/images/export/image-9fa03fd9-000a-4562-87c1-11745b6cc731.png",
        "assets/images/export/image-e6015628-c2b5-4b78-a44a-6c1a7674e312.png",
      ]);

      group.files.forEach((fileName) => {
        if (group.appendix === "Appendix N" && blockedInAppendixN.has(fileName)) {
          return;
        }
        const figure = document.createElement("figure");
        figure.className = "gallery-item";

        const img = document.createElement("img");
        img.src = appendixResolveSrc(fileName);
        img.alt = `${group.appendix} - ${fileName}`;
        img.loading = "lazy";
        img.decoding = "async";

        figure.appendChild(img);
        imageGrid.appendChild(figure);
      });

      section.appendChild(imageGrid);
    }
    gallery.appendChild(section);

    if (appendixTabs) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tab-btn appendix-tile-btn";
      btn.dataset.tabTarget = section.id;
      const appendixLetter = (group.appendix || "").replace("Appendix", "").trim();
      btn.innerHTML = `
        <span class="appendix-tile-letter">${appendixLetter}</span>
        <span class="appendix-tile-content">
          <span class="appendix-tile-title">${group.appendix}</span>
          <span class="appendix-tile-subtitle">${group.title || "Appendix Document"}</span>
        </span>
      `;
      appendixTabs.appendChild(btn);
    }
  });

  const appendixPanels = gallery.querySelectorAll("[data-appendix-panel]");
  appendixPanels.forEach((panel) => panel.classList.remove("active"));

  if (appendixTabs) {
    const appendixTabButtons = appendixTabs.querySelectorAll(".tab-btn");
    appendixTabButtons.forEach((btn) => {
      btn.classList.remove("active");
      btn.addEventListener("click", () => {
        const targetId = btn.dataset.tabTarget;
        const targetPanel = [...appendixPanels].find((panel) => panel.id === targetId);
        const targetGroup = appendixGroupById.get(targetId);
        if (!targetPanel) {
          return;
        }
        openAppendixInNewTab(targetPanel, targetGroup);
      });
    });
  }
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const group = button.closest(".section-tabs")?.dataset.tabGroup;
    const target = button.dataset.tabTarget;

    if (!group || !target) {
      return;
    }

    const groupTabs = document.querySelectorAll(`.section-tabs[data-tab-group="${group}"] .tab-btn`);
    groupTabs.forEach((tab) => tab.classList.remove("active"));
    button.classList.add("active");

    const scope = button.closest("[data-tab-scope]") ?? button.closest(".container");
    const allPanels = scope?.querySelectorAll(".tab-panel") ?? [];
    const panels = [...allPanels].filter((panel) => panel.closest("[data-tab-scope]") === scope);
    panels.forEach((panel) => {
      const isMatch = panel.id === target;
      panel.classList.toggle("active", isMatch);
      if (isMatch) {
        panel.classList.add("reveal");
      }
    });
  });
});

const initializeTabPanels = () => {
  const tabGroups = document.querySelectorAll(".section-tabs[data-tab-group]");
  tabGroups.forEach((group) => {
    const buttons = group.querySelectorAll(".tab-btn");
    const firstButton = buttons[0];
    if (!firstButton) {
      return;
    }

    let activeButton = group.querySelector(".tab-btn.active");
    if (!activeButton) {
      activeButton = firstButton;
      activeButton.classList.add("active");
    }

    const scope = group.closest("[data-tab-scope]") ?? group.closest(".container");
    const allPanels = scope?.querySelectorAll(".tab-panel") ?? [];
    const panels = [...allPanels].filter((panel) => panel.closest("[data-tab-scope]") === scope);
    const activeTarget = activeButton.dataset.tabTarget;

    let hasActivePanel = false;
    panels.forEach((panel) => {
      const isMatch = panel.id === activeTarget;
      panel.classList.toggle("active", isMatch);
      if (isMatch) {
        panel.classList.add("reveal");
        hasActivePanel = true;
      }
    });

    if (!hasActivePanel && firstButton.dataset.tabTarget) {
      buttons.forEach((btn) => btn.classList.remove("active"));
      firstButton.classList.add("active");
      panels.forEach((panel) => {
        const isMatch = panel.id === firstButton.dataset.tabTarget;
        panel.classList.toggle("active", isMatch);
        if (isMatch) {
          panel.classList.add("reveal");
        }
      });
    }
  });
};

initializeTabPanels();
setView("home");

toggleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.dataset.toggleTarget;
    const target = document.querySelector(`#${targetId}`);
    if (!target) {
      return;
    }
    const isHidden = target.classList.toggle("is-hidden");
    button.textContent = isHidden ? "Show" : "Hide";
  });
});
