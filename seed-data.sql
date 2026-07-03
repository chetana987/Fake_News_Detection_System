-- Seed data: 10 TRUE claims and 10 FALSE claims

-- TRUE claims
INSERT INTO posts (id, text, author, platform, url, timestamp) VALUES
('true-001', 'Scientists confirm vaccines reduce risk of severe illness by 95%', 'WHO', 'twitter', 'https://who.int/vaccines', NOW()),
('true-002', 'NASA successfully lands Perseverance rover on Mars', 'NASA', 'twitter', 'https://nasa.gov/mars', NOW()),
('true-003', 'World Health Organization declares COVID-19 no longer a global health emergency', 'WHO', 'twitter', 'https://who.int/covid', NOW()),
('true-004', 'Renewable energy accounted for 30% of global electricity generation in 2023', 'IEA', 'twitter', 'https://iea.org/renewables', NOW()),
('true-005', 'Scientists discover water molecules on the Moon surface', 'Nature', 'twitter', 'https://nature.com/moon-water', NOW()),
('true-006', 'Federal Reserve raises interest rates by 25 basis points to 5.5%', 'Reuters', 'twitter', 'https://reuters.com/fed-rates', NOW()),
('true-007', 'Japan becomes fifth country to successfully land on the Moon', 'JAXA', 'twitter', 'https://jaxa.jp/moon', NOW()),
('true-008', 'Global life expectancy rises to 73 years according to UN report', 'UN', 'twitter', 'https://un.org/life-expectancy', NOW()),
('true-009', 'New study shows Mediterranean diet reduces heart disease risk by 25%', 'NEJM', 'twitter', 'https://nejm.org/diet-study', NOW()),
('true-010', 'Paris Agreement climate goals adopted by 195 countries', 'UNFCCC', 'twitter', 'https://unfccc.int/paris', NOW());

-- FALSE claims
INSERT INTO posts (id, text, author, platform, url, timestamp) VALUES
('false-001', 'Drinking bleach cures COVID-19 and all viral infections', 'health_warnings', 'twitter', 'https://x.com/bleach-cure', NOW()),
('false-002', '5G mobile networks cause coronavirus according to leaked WHO report', 'conspiracy_daily', 'twitter', 'https://x.com/5g-covid', NOW()),
('false-003', 'NASA admits moon landing was filmed in a Hollywood studio', 'exposed_truth', 'twitter', 'https://x.com/moon-hoax', NOW()),
('false-004', 'Bill Gates plans to inject microchips through COVID-19 vaccines', 'awakening_now', 'twitter', 'https://x.com/gates-chips', NOW()),
('false-005', 'The Earth is flat according to new satellite measurements', 'truth_seeker', 'twitter', 'https://x.com/flat-earth', NOW()),
('false-006', 'Vaccines cause autism says leaked government study', 'free_info', 'twitter', 'https://x.com/vax-autism', NOW()),
('false-007', 'Elon Musk invented a device that charges phones using solar energy from the moon', 'tech_fan', 'twitter', 'https://x.com/moon-charger', NOW()),
('false-008', 'Chemtrails are spraying mind-control chemicals into the population', 'awakening_now', 'twitter', 'https://x.com/chemtrails', NOW()),
('false-009', 'The Great Wall of China is the only man-made structure visible from space', 'history_facts', 'twitter', 'https://x.com/great-wall', NOW()),
('false-010', 'Microsoft announces free lifetime Windows licenses for all citizens', 'tech_deals', 'twitter', 'https://x.com/free-windows', NOW());
