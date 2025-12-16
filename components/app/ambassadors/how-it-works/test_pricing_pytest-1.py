import runpy
import time
import pytest

MODULE_PATH = '/Users/momsmacbook/ReFurrm_App'


def load_module():
    namespace = runpy.run_path(MODULE_PATH, run_name='refurrm')
    class M:
        pass

    mod = M()
    for k, v in namespace.items():
        setattr(mod, k, v)
    return mod


def test_find_best_match_exact():
    mod = load_module()
    assert mod._find_best_match('Vintage iPod Classic (5th Gen)') == 'Vintage iPod Classic (5th Gen)'


def test_find_best_match_normalized():
    mod = load_module()
    assert mod._find_best_match('vintage ipod classic') == 'Vintage iPod Classic (5th Gen)'


def test_find_best_match_substring():
    mod = load_module()
    assert mod._find_best_match('KitchenAid mixer') == 'KitchenAid Stand Mixer (Used)'


def test_find_best_match_typo():
    mod = load_module()
    assert mod._find_best_match('Vintage iPod Clasik') == 'Vintage iPod Classic (5th Gen)'


def test_find_best_match_punctuation():
    mod = load_module()
    assert mod._find_best_match('Vintage iPod! Classic (5th Gen)') == 'Vintage iPod Classic (5th Gen)'


def test_find_best_match_whitespace():
    mod = load_module()
    assert mod._find_best_match('  VINTAGE iPod Classic  ') == 'Vintage iPod Classic (5th Gen)'


def test_get_realistic_selling_price_found():
    mod = load_module()
    res = mod.get_realistic_selling_price('vintage ipod classic')
    assert res is not None
    assert res['item_name'] == 'Vintage iPod Classic (5th Gen)'
    assert res['min_price'] == round(95.00 * 0.75, 2)


def test_get_realistic_selling_price_not_found():
    mod = load_module()
    assert mod.get_realistic_selling_price('Unknown Gadget 123') is None


def test_find_best_match_performance():
    mod = load_module()
    queries = [
        'vintage ipod classic',
        'Vintage iPod Clasik',
        'KitchenAid mixer',
        'Old T-Shirt (Generic)',
        'Unknown Gadget 123',
    ]
    iterations = 2000
    start = time.perf_counter()
    for i in range(iterations):
        q = queries[i % len(queries)]
        _ = mod._find_best_match(q)
    total = time.perf_counter() - start
    assert total < 1.0, f"Performance regression: {total:.3f}s for {iterations} calls"
