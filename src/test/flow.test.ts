import { describe, expect, it } from "vitest";
import { getOption, nextScreen, prevScreen, requestLabel, PAYMENT_AMOUNT } from "@/lib/flow";

describe("demo flow", () => {
  it("right arrow goes from scan to manager options", () => {
    expect(nextScreen("scan")).toBe("options");
  });
  it("left arrow from approve returns to review", () => {
    expect(prevScreen("approve")).toBe("review");
  });
  it("stops at the last step", () => {
    expect(nextScreen("done")).toBe("done");
  });
  it("option A is Store 108 with an $18 courier", () => {
    expect(getOption("A").cost).toBe(18);
    expect(getOption("A").units).toBe(6);
  });
  it("button label follows the chosen option", () => {
    expect(requestLabel("B")).toBe("Request option B");
  });
  it("tap to pay amount is $400", () => {
    expect(PAYMENT_AMOUNT).toBe(400);
  });
});
