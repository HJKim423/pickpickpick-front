import { render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import Main from "./Main";

test("button should clicked", () => {
  const queryClient = new QueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{<Main />}</BrowserRouter>
    </QueryClientProvider>
  );

  const button = screen.getByText("전체보기");

  userEvent.click(button);

  expect(button).toBeNaN();
});
