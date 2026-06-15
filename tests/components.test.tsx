import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Badge } from "@/components/ui/Badge";
import { MultiSelect } from "@/components/ui/MultiSelect";

describe("Badge", () => {
  it("renders label text", () => {
    render(<Badge variant="champion" label="Champion" />);
    expect(screen.getByText("Champion")).toBeInTheDocument();
  });
  it("falls back to variant name when no label", () => {
    render(<Badge variant="at-risk" />);
    expect(screen.getByText("at-risk")).toBeInTheDocument();
  });
  it("renders fraud-flagged badge", () => {
    render(<Badge variant="fraud-flagged" label="Fraud" />);
    expect(screen.getByText("Fraud")).toBeInTheDocument();
  });
  it("renders overdue badge", () => {
    render(<Badge variant="overdue" label="Overdue" />);
    expect(screen.getByText("Overdue")).toBeInTheDocument();
  });
});

describe("MultiSelect", () => {
  const options = [
    { value: "champion", label: "Champion" },
    { value: "mid-tier", label: "Mid-Tier" },
  ];

  it("renders the trigger button with label", () => {
    render(<MultiSelect label="Segment" options={options} selected={[]} onChange={() => {}} />);
    expect(screen.getByText("Segment")).toBeInTheDocument();
  });

  it("shows count badge when items selected", () => {
    render(<MultiSelect label="Segment" options={options} selected={["champion"]} onChange={() => {}} />);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("opens dropdown on click", async () => {
    render(<MultiSelect label="Segment" options={options} selected={[]} onChange={() => {}} />);
    await userEvent.click(screen.getByText("Segment"));
    expect(screen.getByText("Champion")).toBeInTheDocument();
    expect(screen.getByText("Mid-Tier")).toBeInTheDocument();
  });

  it("calls onChange with selected value", async () => {
    const onChange = vi.fn();
    render(<MultiSelect label="Segment" options={options} selected={[]} onChange={onChange} />);
    await userEvent.click(screen.getByText("Segment"));
    await userEvent.click(screen.getByText("Champion"));
    expect(onChange).toHaveBeenCalledWith(["champion"]);
  });

  it("deselects on second click", async () => {
    const onChange = vi.fn();
    render(<MultiSelect label="Segment" options={options} selected={["champion"]} onChange={onChange} />);
    await userEvent.click(screen.getByText("Segment"));
    await userEvent.click(screen.getByText("Champion"));
    expect(onChange).toHaveBeenCalledWith([]);
  });
});
