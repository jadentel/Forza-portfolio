from playwright.sync_api import Page, expect


def test_example(page: Page) -> None:
    page.goto("http://localhost:3000/")
    page.get_by_role("heading", name="Hello world").click()
    expect(page.get_by_role("heading", name="Hello world")).to_be_visible()
