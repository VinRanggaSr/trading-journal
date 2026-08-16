const TAG_COLORS = ['#EBB336', '#FC6228', '#02B4D4', '#1C72F0', '#F94197'];

export function tagColor(tag) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
}
