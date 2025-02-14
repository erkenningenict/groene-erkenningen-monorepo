import { describe, expect, it } from "vitest";
import * as v from "valibot";
import { CalendarSearchSchema } from "./calendarSearchSchema.js";
import { all, MeetingTypes } from "@repo/constants";
import { addDays, endOfDay } from "date-fns";

describe("calendarSchema", () => {
  describe("meetingTYpe", () => {
    it("should return undefined for no meetingType", () => {
      const input = {};
      const x = v.parse(CalendarSearchSchema, input);
      expect(x.meetingType).toEqual(all);
    });

    it("should return all for all meetingType", () => {
      const input = {
        meetingType: all,
      };
      const x = v.parse(CalendarSearchSchema, input);
      expect(x.meetingType).toEqual(all);
    });

    it("should return Kennisbijeenkomst for meetingType", () => {
      const input = {
        meetingType: MeetingTypes[1].value,
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
      const input = {};
      const x = v.parse(CalendarSearchSchema, input);
      expect(x.startDate).toEqual(undefined);
    });

    it("should return a date for a given startDate", () => {
      const input = {
        startDate: "2020-01-01",
      };
      const x = v.parse(CalendarSearchSchema, input);
      expect(x.startDate).toEqual(new Date(2020, 0, 1));
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
      const input = {};
      const x = v.parse(CalendarSearchSchema, input);
      expect(x.endDate).toEqual(endOfDay(addDays(new Date(), 180)));
    });

    it("should return a date for a given endDate", () => {
      const input = {
        endDate: "2020-01-01",
      };
      const x = v.parse(CalendarSearchSchema, input);
      expect(x.endDate).toEqual(endOfDay(new Date(2020, 0, 1)));
    });

    it("should error for a non date", () => {
      const input = {
        endDate: "non",
      };
      const x = v.safeParse(CalendarSearchSchema, input);
      expect(x.success).toEqual(false);
    });
  });

  describe("certificate", () => {
    it("should return all for no certificate", () => {
      const input = {};
      const x = v.parse(CalendarSearchSchema, input);
      expect(x.certificates).toEqual(all);
    });

    it("should return a value for a given certificate", () => {
      const input = {
        certificates: "certificate",
      };
      const x = v.parse(CalendarSearchSchema, input);
      expect(x.certificates).toEqual("certificate");
    });
  });

  describe("search", () => {
    it("should return '' for no search", () => {
      const input = {};
      const x = v.parse(CalendarSearchSchema, input);
      expect(x.search).toEqual("");
    });

    it("should return a value for a given search", () => {
      const input = {
        search: "search",
      };
      const x = v.parse(CalendarSearchSchema, input);
      expect(x.search).toEqual("search");
    });
  });

  describe("distance", () => {
    it("should return 0 for no distance", () => {
      const input = {};
      const x = v.parse(CalendarSearchSchema, input);
      expect(x.distance).toEqual(0);
    });

    it("should return a value for a given distance", () => {
      const input = {
        distance: "10",
      };
      const x = v.parse(CalendarSearchSchema, input);
      expect(x.distance).toEqual(10);
    });
  });
});
