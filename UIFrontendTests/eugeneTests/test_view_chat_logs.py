import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_view_past_chat_logs(login_as_patient):
    driver = login_as_patient

    # 1) Click the Chat History tab
    driver.find_element(By.XPATH, "//button[text()='Chat History']").click()

    # 2) Wait until at least one past‐chat entry renders
    WebDriverWait(driver, 5).until(
        EC.presence_of_all_elements_located((By.CSS_SELECTOR, ".chat-log-entry"))
    )

    # 3) Grab them and assert non‐empty
    entries = driver.find_elements(By.CSS_SELECTOR, ".chat-log-entry")
    assert len(entries) > 0, "Expected at least one past chat entry"

    # 4) (Optional) sanity check that each entry has some text
    for e in entries:
        assert e.text.strip(), "Chat log entry was empty"