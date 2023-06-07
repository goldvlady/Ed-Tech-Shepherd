import fetch from "cross-fetch";

class WherebyService {
  private apiKey = process.env.WHEREBY_API_KEY;

  async createMeeting() {
    const resp = await fetch("https://api.whereby.dev/v1/meetings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        endDate: "2099-02-18T14:23:00.000Z",
        fields: ["hostRoomUrl", "viewerRoomUrl"],
        roomNamePattern: "human-short",
      }),
    });

    const { roomUrl, hostRoomUrl } = await resp.json();

    return {
      roomUrl,
      hostRoomUrl,
    };
  }
}

export default WherebyService;
