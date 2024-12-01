export default function handleShare() {
    const shareLink = `${window.location.href}`;
    navigator.clipboard.writeText(shareLink);
    alert(`Der Event-Link wurde kopiert: ${shareLink}`);
  };