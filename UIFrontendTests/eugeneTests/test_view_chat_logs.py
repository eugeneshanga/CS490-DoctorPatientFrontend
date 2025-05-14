import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_view_past_chat_logs(login_as_patient):
    driver = login_as_patient

    # 1) Click the Chat History tab
    driver.find_element(By.XPATH, "//button[text()='Chat History']").click()
    # after clicking “Chat History”
    container = driver.find_element(
    By.CSS_SELECTOR,
     "div[style*='overflow-y']"
    )
    # wait until at least one child-div appears:
    WebDriverWait(driver, 5).until(
        lambda d: len(container.find_elements(By.TAG_NAME, "div")) > 0
    )
    entries = container.find_elements(By.TAG_NAME, "div")
    assert entries, "Expected at least one past chat entry"
    for e in entries:
        assert e.text.strip(), "Chat log entry was empty"
