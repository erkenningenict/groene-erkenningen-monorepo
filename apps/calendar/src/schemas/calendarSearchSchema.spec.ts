import { all, MeetingTypes } from "@repo/constants";
import * as v from "valibot";
import { describe, expect, it } from "vitest";
import { CalendarSearchSchema } from "./calendarSearchSchema.js";

describe("calendarSchema", () => {
  describe("meetingTYpe", () => {
    it("should return undefined for no meetingType", () => {
      const input = { zipCode: "" };
      const x = v.parse(CalendarSearchSchema, input);
      expect(x.meetingType).toEqual(all);
    });

    it("should return all for all meetingType", () => {
      const input = {
        meetingType: all,
        zipCode: "",
      };
      const x = v.parse(CalendarSearchSchema, input);
      expect(x.meetingType).toEqual(all);
    });

    it("should return Kennisbijeenkomst for meetingType", () => {
      const input = {
        meetingType: MeetingTypes[1].value,
        zipCode: "",
      };
      const x = v.parse(CalendarSearchSchema, input);
      expect(x.meetingType).toEqual(MeetingTypes[1].value);
    });

    it("should return error for unknown meetingType", () => {
      const input = {
        meetingType: "non",
      };
      const x = v.safeParse(CalendarSearchSchema, input);
      expect(x.success).toEqual(false);
    });
  });

  describe("startDate", () => {
    it("should return undefined for no startDate", () => {
      const input = {
        zipCode: "",
      };
      const x = v.parse(CalendarSearchSchema, input);
      expect(x.startDate).toEqual(undefined);
    });

    it("should return a date for a given startDate", () => {
      const input = {
        startDate: "2020-01-01",
        zipCode: "",
      };
      const x = v.parse(CalendarSearchSchema, input);
      expect(x.startDate).toEqual(input.startDate);
    });

    it("should error for a non date", () => {
      const input = {
        startDate: "non",
      };
      const x = v.safeParse(CalendarSearchSchema, input);
      expect(x.success).toEqual(false);
    });
  });

  describe("endDate", () => {
    it("should return undefined for no endDate", () => {
      const input = {
        zipCode: "",
      };
      const x = v.parse(CalendarSearchSchema, input);
      expect(x.endDate).toEqual(undefined);
    });

    it("should return a date for a given endDate", () => {
      const input = {
        endDate: "2020-01-01",
        zipCode: "",
      };
      const x = v.parse(CalendarSearchSchema, input);
      expect(x.endDate).toEqual(input.endDate);
    });

    it("should error for a non date", () => {
      const input = {
        endDate: "non",
      };
      const x = v.safeParse(CalendarSearchSchema, input);
      expect(x.success).toEqual(false);
    });
  });

  describe("dates", () => {
    it("should return error when startDate is after endDate", () => {
      const input = {
        zipCode: "",
        startDate: "2020-01-01",
        endDate: "2000-01-01",
      };
      const x = v.safeParse(CalendarSearchSchema, input);
      if (x.success) {
        throw new Error("success");
      }
      const issue = v.flatten<typeof CalendarSearchSchema>(x.issues);
      expect(issue.nested?.startDate).toEqual([
        "Begindatum moet voor einddatum liggen",
      ]);
    });

    it("should not return error when startDate is after endDate", () => {
      const input = {
        zipCode: "",
        startDate: "2020-01-01",
        endDate: "2025-01-01",
      };
      const x = v.safeParse(CalendarSearchSchema, input);
      if (x.success) {
        expect(x.success).toEqual(true);
      }
    });
  });

  describe("certificate", () => {
    it("should return all for no certificate", () => {
      const input = { zipCode: "" };
      const x = v.parse(CalendarSearchSchema, input);
      expect(x.certificates).toEqual([]);
    });

    it("should return a value for a given certificate", () => {
      const input = {
        certificates: ["certificate"],
        zipCode: "",
      };
      const x = v.parse(CalendarSearchSchema, input);
      expect(x.certificates).toEqual(["certificate"]);
    });
  });

  describe("search", () => {
    it("should return '' for no search", () => {
      const input = { zipCode: "" };
      const x = v.parse(CalendarSearchSchema, input);
      expect(x.search).toEqual("");
    });

    it("should return a value for a given search", () => {
      const input = {
        search: "search",
        zipCode: "",
      };
      const x = v.parse(CalendarSearchSchema, input);
      expect(x.search).toEqual("search");
    });
  });

  describe("distance", () => {
    it("should return 0 for no distance", () => {
      const input = { zipCode: "" };
      const x = v.parse(CalendarSearchSchema, input);
      expect(x.distance).toEqual("[Alle]");
    });

    it("should return a value for a given distance", () => {
      const input = {
        distance: "10",
        zipCode: "",
      };
      const x = v.parse(CalendarSearchSchema, input);
      expect(x.distance).toEqual("10");
    });
  });
});
