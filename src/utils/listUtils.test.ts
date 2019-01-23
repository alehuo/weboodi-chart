import { expect } from "chai";
import "mocha";
import { map, max, notEmpty, notEmptyList } from "./listUtils";

describe("List utils", () => {
  describe("notEmpty()", () => {
    it("Should return false if a string is empty", () => {
      const result = notEmpty("");
      expect(result).to.equal(false);
    });
    it("Should return true if a string is not empty", () => {
      const result = notEmpty("Hello");
      expect(result).to.equal(true);
    });
  });
  describe("notEmptyList()", () => {
    it("Should return false if a list is empty", () => {
      const result = notEmptyList([]);
      expect(result).to.equal(false);
    });
    it("Should return true if a list is not empty", () => {
      const result = notEmptyList(["a"]);
      expect(result).to.equal(true);
    });
  });
  describe("map()", () => {
    it("Should return correct object values #1", () => {
      const res = map([{ moi: 1 }, { moi: 2 }], "moi");
      expect(res.length).to.equal(2);
      expect(res[0]).to.equal(1);
      expect(res[1]).to.equal(2);
    });
    it("Should return correct object values #2", () => {
      const res = map([{ moi: 1 }, { moi: "2" }], "moi");
      expect(res.length).to.equal(2);
      expect(res[0]).to.equal(1);
      expect(res[1]).to.equal("2");
    });
    it("Should return correct object values #3", () => {
      const res = map([{ moi: 2 }, { ok: 3, jou: 4 }], "moi");
      expect(res.length).to.equal(2);
      expect(res[0]).to.equal(2);
      expect(res[1]).to.equal(undefined);
    });
  });
  describe("max()", () => {
    it("Should return correct maximum value #1", () => {
      const res = max([1, 2, 3]);
      expect(res).to.equal(3);
    });
    it("Should return correct maximum value #2", () => {
      const res = max([-1, 20, 3]);
      expect(res).to.equal(20);
    });
    it("Should return correct maximum value #3", () => {
      const res = max([0, 0, 0]);
      expect(res).to.equal(0);
    });
    it("Should return correct maximum value #3", () => {
      const res = max([999, 0, -100]);
      expect(res).to.equal(999);
    });
  });
});
