import { describe, expect, it } from "vitest";
import { advisorRequestMessage, REGIONS, SERVICE_DETAILS } from "@/lib/content";
describe("Direct advisor requests", () => {
  it("includes all selected problem details in the request", () => {
    const message = advisorRequestMessage(["Kein Strom", "Nur meine Wohnung"], "", "Störung in Ihrer Anlage");
    expect(message).toContain("Kein Strom → Nur meine Wohnung");
    expect(message).toContain("Störung in Ihrer Anlage");
  });
  it("includes the customer's free description", () => {
    expect(advisorRequestMessage([], "FI fällt im Bad", "Dringend")).toContain("FI fällt im Bad");
  });
  it("offers Wiener Neustadt as its own service area", () => {
    expect(REGIONS.find((r) => r.slug === "wiener-neustadt")?.name).toBe("Wiener Neustadt");
  });
  it("provides a dedicated Wallbox service", () => {
    expect(SERVICE_DETAILS.find((s) => s.slug === "wallbox-e-mobilitaet")?.title).toBe("Wallbox & E-Mobilität");
  });
});