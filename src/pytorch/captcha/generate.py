import os


def generate_captcha(imagepath):
    from captcha.image import ImageCaptcha
    image = ImageCaptcha()
    if not os.path.exists(imagepath):
        os.makedirs(imagepath)
    for chars in range(0, 1000):
        image.write(f'{chars:>04}', f'{imagepath}/{chars:>04}.png')
