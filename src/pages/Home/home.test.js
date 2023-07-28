import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
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
  const contents = screen.getByTestId("contents");

  userEvent.click(button);

  expect(contents).toBeVisible();
});

//"TypeError: expect(...).not.toBeVisible is not a function" -> 에러
// import "@testing-library/jest-dom"; 추가하여 해결
