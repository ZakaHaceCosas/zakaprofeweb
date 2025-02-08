import { render, screen } from "@testing-library/react";
import Home from "./utils/home";

test("renders zakaprofe", () => {
    render(<Home />);
    const zakaProfeElements = screen.getAllByText(/ZakaProfe/);
    expect(zakaProfeElements.length).toBeGreaterThan(0);
});
