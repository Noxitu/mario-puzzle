import matplotlib.pyplot as plt
from pathlib import Path

root = Path(__file__).parent
output = root / 'img'

img1 = plt.imread(root / '2.png')
anim = plt.imread(root / 'anim.png')


items = [
    # ('donut', 0, 4),
    ('ice', 8, 7),
    ('red', 2, 22),
    ('blue', 3, 22),
    ('p', 0, 43),
    ('yellow', 1, 43),
    ('background', 8, 5),
    ('background2', 5, 12),
    ('border_top', 8, 12),
    ('border_bottom', 2, 12),
    ('border_right', 12, 12),
    ('border_left', 13, 12),
    ('border_br', 11, 15),
    ('border_bl', 12, 15),
    ('border_tr', 13, 15),
    ('border_tl', 14, 15),
]

for name, x, y in items:
    print(name)
    img = img1[64*y:, 64*x:][2:62, 2:62]
    plt.imsave(root / f'img/{name}.png', img)

# for i in range(16):
#     print(f'anim #{i}')
#     img = anim[65*3:, 65*i:][3:63, 3:63]
#     plt.imsave(root / f'anim/{i}.png', img)