INSERT INTO notes
(name, modified, folder_id, content)
VALUES
('Dog', now() - '15 days'::INTERVAL, 1, 'Dogs are cute.'),
('Cat', now() - '12 days'::INTERVAL, 2, 'Cats are cute.' ),
('Rat', now(), 3, 'Rats are not cute.' )

