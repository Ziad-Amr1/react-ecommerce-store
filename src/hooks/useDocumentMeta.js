import { useEffect } from "react";

// Small dependency-free per-page document metadata hook. It sets the document
// title and the shared description meta tag, and restores the previous title
// when the page unmounts. Kept intentionally minimal: the app is a client-side
// SPA with static tags in index.html, so a full head manager is unnecessary.
export default function useDocumentMeta({ title, description } = {}) {
  useEffect(() => {
    if (!title && !description) {
      return undefined;
    }

    const previousTitle = document.title;
    const descriptionTag = description
      ? document.querySelector('meta[name="description"]')
      : null;
    const previousDescription = descriptionTag?.getAttribute("content");

    if (title) {
      document.title = title;
    }
    if (descriptionTag) {
      descriptionTag.setAttribute("content", description);
    }

    return () => {
      document.title = previousTitle;
      if (descriptionTag && previousDescription != null) {
        descriptionTag.setAttribute("content", previousDescription);
      }
    };
  }, [title, description]);
}
