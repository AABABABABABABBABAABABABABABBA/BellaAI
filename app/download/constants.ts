const GITHUB_RELEASE_BASE =
  "https://github.com/AABABABABABABBABAABABABABABBA/BellaAI/releases/latest/download";

export const downloadLinks = {
  macos: `${GITHUB_RELEASE_BASE}/BellaAI-universal.dmg`,
  windows: `${GITHUB_RELEASE_BASE}/BellaAI-windows-x64.exe`,
  linuxAppImage: `${GITHUB_RELEASE_BASE}/BellaAI-linux-x64.AppImage`,
  linuxArm64AppImage: `${GITHUB_RELEASE_BASE}/BellaAI-linux-arm64.AppImage`,
  linuxDeb: `${GITHUB_RELEASE_BASE}/BellaAI-linux-x64.deb`,
  linuxArm64Deb: `${GITHUB_RELEASE_BASE}/BellaAI-linux-arm64.deb`,
};
