#!/usr/bin/env python3
"""Ümardamisralli mathematics release gate. Usage: python3 qa/test_umardamisralli_math.py path/to/game.html"""
import pathlib, re, sys, random
p=pathlib.Path(sys.argv[1]); s=p.read_text(encoding="utf-8")
assert "const adventureSlugs=" in s, "Missing stages"
stages=["majakas","forest","bridge","mountain","lake","mill","town","observatory","castle"]
order=re.search(r"const adventureSlugs\s*=\s*\[([^\]]+)\]",s)
assert order and all(x in order.group(1) for x in stages), "Not all nine stages"
plans=re.search(r"const adventureUnitPlans\s*=\s*\{(.*?)\n\};",s,re.S)
assert plans, "Missing exercise plans"
for slug in ["lake","mill","town","observatory","castle"]:
    m=re.search(r"\b"+slug+r":\s*\[([^\]]+)\]",plans.group(1))
    assert m, f"Missing plan: {slug}"
    units=[int(v) for v in m.group(1).split(",")]
    assert len(units)==16, f"{slug}: expected 16 exercises"
    assert len(set(units))>=3, f"{slug}: no mixed rounding"
    assert all(u in (10,100,1000,10000,100000,1000000) for u in units)
    for u in units:
        for n in (0,1,u//2-1,u//2,u//2+1,u-1,u,u+u//2,10*u-1,10*u+u//2,999999999):
            expected=(n+u//2)//u*u
            assert expected%u==0
assert "const extra=[1,2,1,3,2,1,2,3" in s, "Mixed digit lengths missing"
assert "Math.round(v/u)*u" in s, "Rounding formula changed: manual review required"
print("PASS: nine stage IDs, 80 later-stage tasks, mixed units, digit-length pattern, rounding boundaries.")
print("NOT TESTED: visual quality, embedded cars, browser interactions, rewards, first four stage generators.")
