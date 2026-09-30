// Article Reactions and Feedback Store

export interface ArticleFeedback {
  likes: number;
  dislikes: number;
  userVote?: 'like' | 'dislike' | null;
}

const STORAGE_KEY = 'oaicc_article_reactions_v1';

// Initial baseline reaction data for seed articles
const DEFAULT_REACTIONS: Record<string, ArticleFeedback> = {
  a1: { likes: 38, dislikes: 2, userVote: null },
  a2: { likes: 24, dislikes: 1, userVote: null },
  a3: { likes: 19, dislikes: 3, userVote: null },
};

export const getStoredReactions = (): Record<string, ArticleFeedback> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_REACTIONS));
      return { ...DEFAULT_REACTIONS };
    }
    return JSON.parse(raw);
  } catch {
    return { ...DEFAULT_REACTIONS };
  }
};

export const getArticleReaction = (articleId: string | number): ArticleFeedback => {
  const idStr = String(articleId);
  const all = getStoredReactions();
  if (all[idStr]) {
    return all[idStr];
  }
  // Default for newly created articles
  const defaultNew: ArticleFeedback = { likes: 0, dislikes: 0, userVote: null };
  return defaultNew;
};

export const voteArticle = (
  articleId: string | number, 
  voteType: 'like' | 'dislike'
): ArticleFeedback => {
  const idStr = String(articleId);
  const all = getStoredReactions();
  const current = all[idStr] || { likes: 0, dislikes: 0, userVote: null };

  let newLikes = current.likes;
  let newDislikes = current.dislikes;
  let newUserVote: 'like' | 'dislike' | null = null;

  if (voteType === 'like') {
    if (current.userVote === 'like') {
      // Toggle off like
      newLikes = Math.max(0, newLikes - 1);
      newUserVote = null;
    } else {
      // If was previously disliked, decrement dislike
      if (current.userVote === 'dislike') {
        newDislikes = Math.max(0, newDislikes - 1);
      }
      newLikes += 1;
      newUserVote = 'like';
    }
  } else if (voteType === 'dislike') {
    if (current.userVote === 'dislike') {
      // Toggle off dislike
      newDislikes = Math.max(0, newDislikes - 1);
      newUserVote = null;
    } else {
      // If was previously liked, decrement like
      if (current.userVote === 'like') {
        newLikes = Math.max(0, newLikes - 1);
      }
      newDislikes += 1;
      newUserVote = 'dislike';
    }
  }

  const updated: ArticleFeedback = {
    likes: newLikes,
    dislikes: newDislikes,
    userVote: newUserVote
  };

  all[idStr] = updated;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    // Trigger custom event so any open components update in real-time
    window.dispatchEvent(new CustomEvent('article_reactions_updated', { detail: { articleId: idStr, ...updated } }));
  } catch (err) {
    console.error('Failed to save article reaction', err);
  }

  return updated;
};
