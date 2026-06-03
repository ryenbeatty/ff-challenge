// @vitest-environment jsdom

import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { describe, expect, it } from "vitest";

expect.extend(toHaveNoViolations);

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

describe("accessibility smoke tests", () => {
  it("Button has no detectable axe violations", async () => {
    const { container } = render(<Button>Capture</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("labeled Input has no detectable axe violations", async () => {
    const { container } = render(
      <div>
        <Label htmlFor="meeting-title">Title</Label>
        <Input id="meeting-title" placeholder="Name your meeting..." />
      </div>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
