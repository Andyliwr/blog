<template>
  <div class="openaccountresult">
    <div class="submit">
      <div class="cow-icon">
        <img v-show="open_step === 1" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJMAAADuCAMAAAAKh8U4AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAMAUExURUxpcfC+Wu3n4iw6Xuvm5Obd1uvk3ufm5+jg3evk4TdGadG1o9bKv6c4PM7V0trBtN7Z0DcoI6tGSeXb0t2vYta0q9CZjvHIcktYdoWLm+rUvejl4qQoMMKop5wnMOvLkGVrgue8kOG6ca1GTb1kY+nAiaChqunIob2PkenFnNjNwnZ8j9Ghluff1OvEkdGbkOvdyu3Ccrq9xYduVk1Ydem7eqyEdbxoaevDg5kjKsd2bNqXPZ6Kk2hxiMuXTZqgrrxvc+GwYuG9i9ebdOfQtqRxc8yWcYUQGH6CjpMhKVdPTteXcuCqVXMmKadLT4iMmTw+SKqstIMRGmtna5tFSTcpJAgWJ4gQG3IKE+mFhZ8XI5oVIfrJZQcUJf3qvPPJquKtiP////r7/PfPsZETHWoIEIMOGH0NFvW+VKMaJvbCWeSwje/DopUUH/nTZXcLFG4IEOTw8uq7mdbs8p0WIowSHP39/Oe1kpgUHykUEMzp8Q0bNvO6TPG2Stzv9A4ePPLHpxIjSu2/nu74+e2tQAsYLvO7UeiHh+f19/vjue6yRfTMrvfEXfL7/frYteJ1dJgJFvfHYvbMaOmnOuKWKf3phvrfeeSbMDceGPXRrhAgRPvifRcoUfnUtPzbueZ9fffVcfzmgt+qhC8ZFJ0OG9h5aeeiNPnWau3w8eLQrPTNzQQSM0UlHgcWPOmyVhAGBf7sivf09MLl7/Ls5/POqgIPIvnbc1AcMgYBAePp692lf+nPvB4OC96QItiYc+2+ZtaScIIED+fFrearTOHh3cfU2dKHa96iS9qfeNbk58LKy1ZAM3YXKkk0KvrKWu2uZPPasMfs+rnm+ZV8aR0fPX8TIf/hvnQPHWhRQSMpQ9y/myAwV+/j3Zuksay0vrpXUHwBC8KsjIuYqdG1hGMECLm/x9SmmH+NoJAMGK6JT+iBgv/ww+rPoYsFEXpfSM67pbKYfNqwsOyxfAMJFzgiOdLa3/C7kZ2AUNCLLcSjZM+LjOzZz4NXKqB0PcWDQWg/IzTdk/IAAABWdFJOUwD8Tf4lQTEHDxn9UP7+/l3+/f5k/jZu/fyyf3L+JeL4/N3+1/57esX2ltr9i5mwrL3inP3co/3ExPr+/f7K/K6Xx/7VqUS86ZHGy+7kiqva+9OtrGTUZx1caAAAIABJREFUeNq0mE1oIlsWx1+J5QctHRt9T1AGiSDSmWeINAGhIZAQZpXt7LJpV0UtBAn0otFsIkWQyqKqjD5wozRYBpqi7YAgeU0tKoP0SKqn32xCM7tZCU3e7CQMecw595blZ+Y9Q/c/iR/Rc+tX5/zvuVX3u++WltvjXj5k+Zhl5HREAt7lQryBSID1fDMityO5trYWWeoAzgiEbERc3wxpwwfaWCpRDj/G+JPeb4bkPz/3rTmXiYr4fectv2/J7P7hMwak9ou2f1kmf+ZF+9K35vgGSK4kIr1oz+TJDfJ4vU6Xy+n0evCde5YJoy59SedXR/JEfL7zl5mXrUkmj8sRCCd3N8ZKJiMBh9M9VbtWJvMS0hv46h3Bseb7VybTzth+8rgC4d1EYjUV+wjSQPAUC0WjCSCLOFyesZ8ybYzb/dpzz4uVy7RbbcrkZQPh9dRHzTCa1XL5vaVyudpUDEP7GNtJ7IYDrNdiakNc+/KhiXKyDnbhrGUhTe1Wq9XuPl5zedlwOqgpVaCwWMr4MAJDNEPTU4kwVBGYLlsY2LrHUW4ny7run5RuNrkaTUQWQHmSa/5zHPoIZlB8c8+o0oOXq5CZnkHVazaroDJVVdFiqfVA0mJqtfwLp57XsZuAnuq8twElQnK9Eg3P59i5ASN3c7nW+cVOcA8P+x4OamiMJMt1W7IsS4ymQT2rlFfRUtGzM3+r1e22Wpe+BQN7w6shXY9eJO8xmyOtq5VGrZNm3XO0a74uDNy9iH7sVWkSGFmtV2qnb6fVqFUqwCYKxGjVJhQx9vm/3RzEdn27c9nwBKL1bFZk9OjiwrKAVDs9bVQ66+zs2UR8fhjXHw1iCqpFgZc78FUL6HRK9F8AxpSgluh6befiEpkWFI9N1yuNRsfMl6KLGr13k1EbjUatBqe6PpNJZ9J32b28iClwDKXAQIFrliqzqjVGqI26zAMWyAgSqvkW5VyvV07hBFQzzyTm3eaO7/GdBjlOo1Z/Og3lAjv5d4LNcrNYENVKpVO/V50OcAGYhcUXFKRSYmdwUrOG8j4NVSCzjU42m+VCyTm3OdOC2akRqEajEpqGgk5wBklqFgUJLK2ClWVpSrxInmQUIYNBCFajIxEqJXjmh/Vl6rDeeAoNAGnKZlWTScw6xr2S4rNqB4oBoyHU+qTR2cefwUlKAYiAh+d5jucEDsQz+CgQ4VtRpGSIVaHZOu2IJQK1c+ZLTnjG7SJZArdgmtQsl5qdlt6nugmfUEeAJTp6emX8FcdZsNosSFnIkMgJBVvWy1LJep9HNEAWAUuFKlJvNTp8sakoveDnjTGTM5Cuo/fg/CFNcGhe3/XMuo0x8RPbDRU5Hban50qwqfD1jipLXB4IUEUQPJIX+EQ0AuOwltkszRUMVpNLClQwuDvKAAsrU4dUBMybJUymnphp1q40YbKgyDj11OYK63J6vV52UylJnQ7Ujc9TmqJSVEBF+ktVskW4AIsmC84RzC4UlaayveIABcJPE9EKJBHdW+lk72OieZItqAb2GfBeKLW5GY8/3VYK2Q5aWxSASLHUJI/FsUpTWAVKBcmCdDUadQ5Cjdjq6moqSlvGW2QaISHTbO3AT7z1IZ5aY0QlMYzWU/IqNmdEQhYwbJMQLYKZwMoLnCiSxQdH7MiSyDA4bTvknE8JUj1rM8153O1IcVmVforTj/SEU1wqVEYT61g3iSkVSbOhCRoT2U6aEfwTHS+RDouVqlDbUyCSJHWMxKfZuf6ExVPHqarUrPxWoNnUgIkpFIGmiFgTSGNv5wv5aVlTkzNVGKtC5xhtWzRJ0HnHSCrHhD3zFwVphreh1LplK1xr3iKZXECCgiDk80UbyeYBCXlhUvAPAbA4c1/GxbpC+17NoiPLqk0EhzW19QVXBu7AKsNDquwC0mCrH5+qPJffGgzvBltBDqjGKaJJsZqmLQvMzOq3w+FgECRUNZKcOl5MnNYm6gZIzHzl6F3AKsOZY3as/Vuy0ONZqWpseN2/enLVvx7o3FSKZnlIg+ex0++Hbm8g5k3/ehisk7aAKyXpAjYSPJscs84uvjD2ONZTE1Sq1YdhgLrEm/qzJz9d9fv9J6+vhnq+SNvQJBCPDRx+8BcfOG6//p/+6zcQc/X69U2sg6mvkNVwsm5IlHp67/2D2xkAKoG3cyrL2FlgwilKYdB/cwNVGAyvn1wNxLzVGYURDeEYC9+a6m3/yfUdxtxcvRmGsvtABbNF1+UxkikAEfv/7tzhhi2+ua2RZKlZxtAkWSwpcGmmbN3073q9ntLs9Z5d3QRNsojgQjyFM7pO2Mc32dDw6uYWbrIMIzjoX9/umyK0J5nRDMYCEiFFm3H2d+9GPa5HceDa3mMYo2cIJbyGLTdLg/5Nrwh3BE2lELyB8bFq3ATRCMYSvlJj1/BFDuegqQ/7Q90UcHVmCobB8DzDpLZhlVhx/cGNBPefvn/0A9yeKIUiXlXDxX7hrn9XwuYNU44ZXv9T5/K0alAmAoQc+xOS9rP12/4zfR+ZwVq3fUgunIYI67jR24YlK/7o0ffLbmx44nvNIrk7gvSU7q4HJdqVCvzgeqhZvkZLIxD5m2GSb6+H+r4oYR3N3jVhAiiJLxjxh239uB3bwFK1mJq//facIkFH2hpsFWxvi1MoU1i9rVsdaInTjMFA4+l5wJzZZh+2j5LoYdXK1ZGaCu2UhRL4rDAiEmmOFjJxAkM+QiomqI16hihCoh6yHeUNx5CnPMpTkyx2xdFii4srddL+/Rp/JoloKt5KlMgY2w/Z0HCQNJWrYyarcrja0ytc29y/L7yNoH2U1lzYiz9kuykGE47cYFMkuuySNAlWVyJE00yyjL/kbyZjEu2kZCnkRc7YXN7l7C5Jk81kXQqUtIKgUSaRn8uSTJBszWCR5k5WZ+hO2vbK0kyR1efl0U4EsTc6HK8niZfonBPR4FNEIxh5Qe3GSNgQOCO+7G6UNxkjGzaj/SRaPXrJhNdQwshS0nThbAQTZyM2dhP6k4nftO4EC+RX5I3tZfc3WXA4AlWfg3oo3F8yyA4ho1sK6bBez3vcNKXQlHRJn9BHXQcDgMtXlmsHbizd+/fPg//+bOvsDP+m9SUqTdcPcyRHzxbpH+OXO7oGtx5LutxDStf79fG7dx9sdbtd8pBrtVq5XK7bPTj4cPklNMMkhaIY9Wo67GAchWEXMYbX0su1KOeGVq32fn336dOng5EOc8fHhweHx8fHRycnJ0dH8OLw8PDDF7DOZOGk6ONfPr16dXDwygo7tMIwahR2cBHitdRSe65u9i93d3e3f7OJDokAKneYy9HRT3B0GN4f4qeYdB8gYQAJy+Uw6hgSZEPRuM9wbf/jMsXz/PDXn3/+6c+vDm2eHNHxERn96Ogkk8lYw19Gp4rHx/7+yyfgyE0IAsZRJFcn/6PUfF/TyNY4Ti/ttiVwW2+TLXS5hBRKb7iX7ovQUMilUHfZF5f+CSEmmTeh8U0MNBiiiIbgdOpA2sI6L2ZeVLhYEGUTYePWbpexkqq4sRVEJAompKFsSESIN0vT5j7POTPjmBhjHscfM875zuf5MeecGXUVU77of7pO0xP8y7C0FP3ntFsPpKhj7kD94UNK5Ylg8tSJ7ODgmevJd3Y34mptMEKueivAgoj9Ox1dMnSchunbz/v7+xWIk90+qTG5CZOqPgL6KL64BUR0THmC12nIRNg1ogaoEYVq5+Pn/f9dO0VvcPZm7OmPA+UFKCf7pC51bgy/x42HHB0hUMh0Jrh89yNeCHy8uxwcuwolPnkottgMIPF9ZGSERDhzdXD+9Wl+7fjqux//+2wPmKZ1BY5IYAqUqj66WPi4v38A131pgyF9sP/5LTntpg+10po9VKAyV+efvL5z7hQzzPuvnr2iTLozeiIRTyaTuxG/x+9X1CEXq5WU1+vzeQMBry8aCnn7Nt69W8C+gJ4gbndkF5rFd/2jHj9AQQvK9Prxk2DnlfZPuyv39xQm9JhCuRMbpbXNzbViKRlxqS7Dcjmb+vng4GAf7cBgjaaL08g0rbSaiJeKtFl8As4+F4V66HkRPANM7RfUxWtanFQo+8RuaROk10B/s7Tr96vpG7ncv/+3L1/2cFzc+/J5/yBfXCBMtFkkuUZa4etGHWrEkwGmM53ftz0OX+zFARiZFhQou3u3uLlW2oDcbYDbxTdapEZW178MxPAifWxmBq689j6WdM0mAAkCC61K0D7pd5HTA5qNUqabbRfU2d4ByvR+QVG3RzbWivEIOY8i8eLmht+jurzYHZxRJlOPfx+bsXUm37+nrabtdvCklKCnXwIVsIegzShTT9sFdfb2EaY4CLpdSlcDKwmtR1jsPvPg9/ptgrnryESTZ5/cWCslXEoPNQEr6ApNeiY4NzgfXP+m7a7g3rNGJrt9Y7MUcWG3E4FOOlIqJl1EHaCAaax+C+PBjJ4pUVpLukmXgN3obrH4xkNGGUh6JmibxyJvn+mVxkTUUXzD7cYuIQK9gj8JHo9Sdcyddl8F5v46pml7vFjcdSuD5oQrUVyLuxQoqKfY4yexzu/bPfHO3T/KVIxP2JX+c8IdL5YiHqLuGSVMONcmNw7GaD0pKY+XNna1cdyNIm6PB0vK4yFMwfZPvCNM04l4PGFXe0+o13g84iYuuzzANKfF6cGYjcZJbbaboI0mI5B2EMF8+yNAlonNPhgEpnZHl3N3KVNdHOtV69HVsQzHWTcyzVCco0zTk/ZJ3QxMbeafwDjNjg2eojPo0DOp8lrXrJtNwSlFmNR7mPBUcne41SQEStfMpTLd+cspmRYaxacTh1wmo+tqt21Gd7v3KNP05KEAkwnni9js3DwytTn/7RggTH+q6gsN2rp5HtbUy9eP9Dd9bcGdxlZN2kE5LRqB6fHj4HeXTsX06ks5TuTfKUbU6RTETqdqIP7pesymvwc982gdXHn/Tmd05NOYsJn/RefTR3MPTskE15t7d8vJeIP9ldplxd68ufzSGIMwzdGFJO9RbH0nqduZtnjTaIA0a7ONzQfvnYIJ/3oysPxbeQcM/+e1o1p5p1xe1+x653JsZqzxN43ZWOef6+u6ncrrO4cuPwtvl2NwjT82eAomqPHllWp1fMpoLBS6t8CUa2Gj0Tj8/O2vvy2r9vQR/WWDPufITz+PZrWvl+/++vaX58bCVoN1G43VlRUIMDB1tM00sFKthQWezaCxLH3PZISMIIQdTgtKrsTovc0mZiM/hT59GlupGrvNjjCRUC2DYrxgrq0E5yB3bV5OXbjRWXUK7NDQ0B9DTQx1w2FzDbiCTZEIlQ2oUYUdam4sb66uvI790CbTpTs1hzTU0tghVnQ4pwiWzXb0V7sgxNkczrDNvRoi7rJcrbr8Q3tjcNftmsAOnWwsT4NFsOpG/i4GmefZ5r7o1sRam0wXbhiFnJIjEPhDZ6ipF2UBy1kjXNqf15DHaQ6zdQpVg7wrqoqKWL3X1qVwx52wpNZjjhwYazuTkViFQ1FUV0XOXAMbr1bxRK3VtjJ8vYh0GuEtqHVJyuVyrMIF24VabxuBunjbIUksj4btufVKf5ZYf6UswxaWAOuixUq8KAocZ3I4HHiq6nCIWzk2XCgrIqDxAkQlFg5BdmQdPSd3Bhe+7hElXkUqVPryqUDAEEiDpfJ9/WUhl8OvWLYhhSpAw0YWaOH4hUoWRFJpYqntbKXA5ySigbvxlt4Tb/j8/ZZJ5HlYBD4XrmynvT6r1eqj5vWm89kdSRJFBevYE30IeYhbLyp9gBMA8xoMXi+8pLcrcg41qGPhnq4Tw2RhREiFyPCS3J8iQF7FYCVqNWyXeUlkEEtqzkW2gVsiHraQTQEMABGmAFHxpsExdJvHwuMtJ/3y0nXLDMdjGEbMbWXT5CYA3gygBoDWaDT/QeIZhhwSuCRJYg8ZRAidQm45m/YGSJB05rMa+go5SRBJsCXHrdZT8vNfT3EMMUmqpBQkkj7NQtY+WUJqFYtwacZjxTMC1eAqUIzpgOKYVykAry8a6BckEEAoKdzTccLFppkiMTm5z+ulHvoamULpiigxqqlg1HCNbCRf5Qrb3kD6Z8UxokIDHrXmd9AvASpEEk5I3qUeh3IoSd72BVQmDSoKS8iXZepMjSboV8TcTt4XSKlhoiL0NZqqSKAhCAIUp/l2V8sufMqkCDYwWfVyIcPxTMxhJms9dbpoR6OpMhYlqTne0TJ5XbcsnMrEZQNq7qyNuUuVRb49pnr+9QXgA418gdYkI/C8afxSy9Q5VSZRKuexxvVMJHNLviynQ+KawKjbeKaiajQ4BqHWShKyF55qVVA3hqHEOTQIFAMnntWrD3s0Gl1asm6Di7ADeXAM3RlXGPpB+UweogwatH+r5y4aguzLqIENGJgmWloU1IXeYTOnGsNz/8h7o/oigCCBXEGi2JyJa20mE0LlvVopEpFQKJrql3lFAwMVdt45vqC+ujVsNoEUPuGIvPghmzdEVQstLUVxXJAYk0ndh+zHkfc6Cd1AvoX0NWqEQr5UXzksMQ4qwhGmnkstfpUeN5vqxomS6UN2G/9fBCMV/seoryLzPGNymI4aV8c0USZFQ3SUVQ0DamTLeg3CZB4+9i7U+Ss94+a6HDRjeJ6TP+A8ow/mGeUdWZTEpkTHGmqInKzOVSrlgqlBg+NOYLrWM6xnMpHgS+iU7JA5DvpckaunjWsTCyqTtJNlLDBJSb32LeZuuLd9JgcuHO3ZRIbM2qiZyOJwtBUpwgWDG447nOlQnIGJc1Z7zx/PNO7UDqczE9lgNjuPmNnRwszEnOS1wRWTzhkB4/S8NZN6FDN5KnpOy5SF2JTy0MzZwuBbdSdc6EdNXOHihAzmrgXTMPXKjDR0QUMWp/yymcn4OGq6b9WPskw9c1I3zRguGqiwpQXTNz3PLeYjBlLyy0+fVhfB/H7/Ii7wUGy1qS3io26rZL9PnwAN3avn0mQKC4JjqgXTlZu/WJogWeTVn34abWn/Z+VsQtvGtjheXps4H7UDDjGheEweNjRDQr2rsZlFII/AYAhdVdQioBThYBwRJki1oIvpy1CyGqLtK4GAsMG80IXJ88IqGLukxvX6LV5pm/QV0oQwWYSQzXQz55x75Y/E+fax/CVL5/7u/5577rUlK/c0x63Nh7/TjbbY+PRmKbVYDzAm03zy7Fxwq+u+mTrFhEhPO2e5728X6wHCmJakc5h6/2Eml1hXwWWJltTimxwdO7x68W3Wzc7m3vCYmudtB93unKMujnuSubh0osunUsgEULg8e8pe1O1Z6zN7Yps1bcN2p8fZ3PfFVAvTi5R1/5wffwf/bqVYN6aF7sTUQQOdUk056z//mk9a5/1w3/3ASrJ8gqmFcgowvd141kHbeJuyAwqQ/ngBo5153tFOxz1TWmy1pcVk8u2/O2hvpSTUdr6h1KJ5/kG8rvskVCtTKbO23DHbrxSTSzbT/PwfLy5oOphp3rPM1AmoVCmTWemYZTJVCtn6cLFoWoPnfznvflA9JZQFTGsdspVMxWSDpK1U0rroMFDPQNRK2aMtH26h8VaeLD/pgC0/WcmUUkt88GYp2bIuPJ7fOx41U8DSbFZlZX+5A1AQTZmK1TqnkKoPLj6CNzRVlVKtlqxC43WCan8lU0xCfRuRkaxOXuKsOkf/ZDV5AkoqQkjtL99YJWg5kxzW+48VvczvmbccnkmrPdSTm0i1jCpVmj1DvFrFHy93PLiHQyXpxqGqFUZ1XY2QKFM6UVmrGLzs4WCAamo+9ipplZBqjVX5ikBAtJbJVIpmktxx30lAuvy5Rj0eDPQk7o7GXpmcap9KWb5UO7Lt9iEtZSqlqplsuEOkaPAqJ7Y7+qeilpQ8YWaVqCCB7tvltUeDlfZH+wAE2btBxLBSSakaDV7t/EzHUDBaPQWVlKwiYhHX2v5+kxgtRvGzD/oQD2pkmdJJR5PjVz5Zu9czWUSp6gvXyqoyLBoE1wjNhmM5CIxGEYZDjdaiEVM8OtV/jZP/e/qD0WKjASWbS5KAC8Aytq20DtGZlfonlVKxWrUkSWpxIUEMTI4PXe+6AUOeqRJQSQTCLWm/Ab3AShWwTItVMriuhJ9aplmvSH1vIuq/9gU7HP3jk1BVqqnUYlSKCWYhW6kECzdAqVqWhZ9JTJiWfaxqdDI4cKPrmvQMBCdLHOsMM0+ZdLoOkq1tdOoGGtVjHagqgGWZdQjp0mbSjaNb0ejklGeoExfqcPR2/Xg/ilrVRWgqzzyD5aSUIBEC/dCxC7/0dg3+OBmJQKxAt24lu0gm2NTE3lCKBELjnb3ASo8n5HZvbwci1L2rGMO8QSwqlpcOC1PTIoMtsWtGAoHtbbfTHxof7NjVTBx3+iemfYlEwusELgCLVDDCilWWDrCrUdcv8lclShFwj0QiRON0ehOxWMLrjgQHuzoRTz1DnmlfOp2OxVTwGxPDXiehARzKRhmq2UooDH3udgNOGPaK0b4q+PAGgoPdjpsT+b3gLIEVhQdZkxVFlhVRVcNe7/boN9tMuHEb3faGwVQRttRgezFG+8LejGrgzk2oHEAEGqmEgw8i4CjKHplsyO7RHRc7eYidekSvav93H+zJgoCb7MlQCVFUGRP4QCp/8G/X7353PCFqNXKHfmOyrCuKrisy3HVjzz1aO8YTG38vHLtc797/hv81KLiQCTaB7dCgDqIocijUykg7Q/e6r5vDJ3yqkeayixgXigb+dVjgLoqGjkyFXC5bcO1sbW3VNrPZXK7gGnUbafxcVGFRRR33UROJBlU64Q4OXmN8cXSP+2M2ETjS0b2siMxUeKMS0/tsdnPn809jaD9tubK57PGo09A5kIo1oRrYEcm18obGu68+pIS8QESesNuoSALtxYuilWndiUyFnZFHH8gejWyBVC5gEtkWaImYImOvU9kb9IhQqjt4xYux3Rn3p1Ek3ou5OqIuKyqtZKiG92HN5XJtjbw8Ipv535bLdVx76E2rdaCYKAuaCm2vN2NChYxE6CrzA0fXhDNtiLYLG0mNqRiw9lpgCj+s1XZcrt0PR0f5/Mz6h7Gaa6dWe5gw6uWrcjwuKJjXRKYd1xiylSH6L99+PQOhhJHGYFDRj1i3WEKF/iSLdaZYAHTazNX6jvKPX/662vd5c9PlqgViwMSKlrV4XNPtipHLmMqeYrphOC/7zaV3wC8ahsrVURtIFBUiJhyVNUBaDdwt/JKbLYzMHD1+/mp1eOc36IN3A7pByDFdQ5GwKk1VY52ROqRhhEOXgur1+A1DF9uY7QqodAqrtLF9F/8nkd3979HLV6u3x97hPw3uug0aiFRFmItrClNHVdU2HiHUQ5c4GbJ3/CykOpmMEUIdz3Af0r9cdh4dvVz9OPy5gH+oOSQmFkqyqIrn+YKgCl14AtTZKjW01wRNpH6nGs5D+j/J5nD++erHkXf45umhM83CCZpZOSUP5pPmt4Ye6r8xki4LFOUqMX2jH8+zI89fv/q4+wv9AP6n1+52MDrqrUw0LLWuAaW6zu9xZyE1VmoMiTF5/2RMY6/WX6/u5pqYqBuo8gkCHAVPer4Aqh+Q2vDgOKrrLDQgAzYSl5FgTO9HXufX/zmWJaYI5AiGHEswpXBXnYZJJKqPl7b7vfDE2bPioWmukt4iDRBB9cAdpHFZiCuNZGyIEWJ6N7yez78ewRCf3QikeSpA03EmAWKBB/Sj6ND24IuGcp3XOG34xs8aZnonwgZK0mw6RSUywcxJlmFaJNdlAqZ0YAO72s7w+gwwHSPTp4DRxIQxJbNpIHMioiNFby4HsqH/jIzQ4/Ed0I44RSIeneqlYC0JiJAawxYxfceuttUHOq0P17Dffd+uM1G6hsZuwpJtEFLeZtszQt3tv4j72VSsxUSsJ/JojCku07jKwdLp7TeQoHKfbz8Gpr4t/PPiG2LiAyWEuRAXZNuYE/SnNAkF7w/CE71tW04+QCC52SAINObMZhIUvTGQptNuTFDZrx/zyPQ525QymSnCwoKGs3JyoMm2+5ZygOnA1yZ1YsvB7FnWW5h07GcaOiW3mibACCbySRUyOQ8hyAtjr/Iz+ce3vwJT7tDJhxbsB2J8YWFOIx9415gfmT0228Fem743NL13YFeHG8zxMR2BaRp/kDVhbkFj030M4DQlzQKkgpl8fnUXmb45+dCCkyxtbo7vSVD0GmoIT60Nouwd+E6FeY8nXBZoc5m+AOECSDADF4Q6FTJp8bk5hWawUChPmseQCh7P5H/FZMBTJpvo6vE5AQHQrc2ERDAQqgoXjPQHobRTQnVNC0wmgTUU7h92O1VZ4Ez2C7A5QeVKYdLcYOlpBpLB8HtIT/bQgkhaXDhpzFEcehMLBh4TslD2DZw8eBAuk0p0Jyv7Jjx+Xav7ariFaRoTSsWkuQHTgj5kmnk9/A6YIirO6JAagqkdkxbXwmHtwA4xu9ADeaI1cXZPl8usWMxBhCRM9P7gPxDaGbSelwllGIFPs7mtPq7TzjOeMmnGri20Y4JuorlDfq1MxbC2xEKFsr/1tDqP70u8EThYly8/D93q+bnchgi2mBN4RBFT9uvt9RmIJ0pQyIS5MpFQ5togMZ39A/f85TLh8CiD+xefx9Gam8o8/HhDlX0e6Ittmcirwr4bE1Nh9yNjug0JCtM4Y4LMdMbe5b9oO7vQtrEsAJvYjm2lnm6SdmuTpphOMQF3KLhmhilx8+TGCaRJmmkiEvyQUsvkIUgPdZkgWCEWPS70aSnCD4XkYUE1YVlMM2xg1svszm5/nlqTBNPGFLedPrRsSUtph+3uOVeyJTlx4h/1VJElW/f60znnnnvunavxiaOO0ycqlqlIPm0yXteXDKM3LiwFlsOQVdqLB2Vm7rjKtP3r/LuAOE2YihCgflUz32sL34OaGIapwwT5LEKZ3/6y3+Dhp2u+PJ+/eBS1N1ximBTWnDJs5Dx1VZ2SuNHzV2DKoosnEnLoh/m442EBAAAKOUlEQVRDWhifA69j6kh+OIbpYy1UyRjLPWfSpZobwU8938yU6tQKOiADbWD6uxoKpoFJCfx7Xg3j4E0QwOtRESYCZVQjUxr+rVufGoAvN6lpmFjW8Q2jM+nVp1DY1Pcqk/fN/F0K3EmSJCXre3f9OQ7MIRKk2RRcyeyJVRqOuUicHtGhwF3Sho4YMt58yUCcZy4Swzrh7VQdYWkGQxCOEq5DeEokJFmUIUBdeU4G5gtzhQ2NaQ8pDX9HjOSKjWjfy+SZxZ5Pny549OHTCSadNhCPELu6Du/DlOJo4lErx5//+YkdbCeJGTFLPYOuhUyhLW5s1C2aYjUmhMoz2Nfk095PR279aGA64/Vu98xUHK6kWo40O5aYSTVW5Z5ZckInZ1Smjz9g9pTggUmmnpCuBT5I07TOUNCrIRVUmWy22CUwH5M+vv3zjydPftCf6HKc2f751hFvXnUeaHP9mvq+LdGsysDilqqc4DHNoUch009PMwnClJHtj3/6uIBMi6BH/fpqYVbdgKnqzLFLkMz0/O3YH0++PPv6bNXJnQP/PHnr2HkvCSip0khXZb5nmCNMNNTCpGjCQk5QaI7DXm9l4eMXL4REYlrIZDJi8elvPsKoBdXE0QSdVV9ouloYb8fAhFDfnj927OTLzZtLt89q0aB/avP1+5cfTp735lOMoUE6zhQ4UpFWH6GhdaYkM3t8YWX2490AuLiqp8yLQ+fmVhYMTIbChpONMUPEjl0a3v7w/vW95dW11Qd+MtRzf9e9vtx97+x//vXJC1oqXawE007CRNNYk7qvvMD9Qs3Ey6+tnHviUyA4SURRoWfnVpBpBplSpIBarHKSUm/LyGSLjQ1vPsB13Lhi/jQJBKNwvLYOVB/Oe0vY9VaYLoBT0DoTzdJGQFQUOtSpxxqTWCzKvsenkGkxZbpy1wltYrL1j90GBmRaffAQG/yFe+vABO90vz+ybQylwFTWoPYUrpzCmcntQQqYcPoJmQa3b6wszBa4/QqCDsf6zU9pjS0DAMhO9yY4Tfjsg3WVcfn1f6+yF/UhjXPgAKYkGG92pSdEET3JRXtR9A32rMyCmpJ0U0wAtQS2ujkxMeGzuTrG73WjztZWlx78jzVYDpmYfZnoJAlRPQE78XFgoopUoGdl4bhqun2YuFomW+zy2trN0eDQ05DN5fTjuvzldbDk1MVLI8as6iA9gaIKwOT1FZFJyNgpKmMPeDESsAcxXapl6h9dXx8Nuju+eAaBsSseD8anLq+tjnb1x2LGwWjHAFvev+rkxhzqCbu7aaFIUXaRCoGeFg5wp72YHONvJ/ydNnffV6TPcWGIWlqO1g6OD2Di0Hjp2YXtgVAml1OZ7C8Gem5cu8pyTevJMRkIhc1jhODm5qRjFxOxHUdumuxNh8kkXS6nQE9v7gaEXAKY7MXAXRiZz2FwovXLq4ectoeIsIvJ3RsO10xj9A4OhnfriS4n8buTSQ434yE54Mpl9tqC9w2MpbLTPIQC6vHvIKUDPaFdydX65XAL2nmSTb3axYQ/hlO7BhIoa4fGHV8DU6Ue/SsqO/yqMn31GiR1v39sVxQ5Q4Xe/eGNd2UWm516eXKvkkmWeTXSwCPdLsfuGQSNyVC74URVWjnJkBkDHLkomdA/rlwHprl0ylRmlzTItOdjQV+z5cqX1xEw3i9kZuVdSIQR55V5YLoxw+6PlKTbYdL1xOl64kxM3Ct1ivyZT5t98r5ikwcInWqLiatEGk7dYWujVWfC43I5mVf/U8Kfnj0hM6xvvHm8Bi9QhSiaqwgpSpMBXmtM0O42jMLSG9iSNzZo8gc7gCrBAI/I9XmNSU2d2Er2RxKUStZF3mbSv7TOxHKFQuE+CrwUChtwYECEEzpZ5noO4QMZ2mMbf3nuzbMFhikUqqOoQmEmPVMZRc3MwIfpxRvtMDEz9/cTbHn3Hw4a5CFQ4x3cL2wUVMEbMgiepRdPOVtlurN8+86+8haE7HSB0zsHyuuBFpmckxMwHHm0nwgovGIQ9fot2OoL/ygw2TITRGeeF5oT4BRFWRZhyFBHxKzsG+pvjalziJJlWeABS/1TNxTUjrqreR83AQrJhKr6j2w6VMYXb5HJEaagYmEa5ye0rXokaXvtzHSFxO8lAnLCjqD6gu5WmXxwtzzk2tMo6h5fTOcVqTndQ5Ad9jIwRbpaXNnj6QsI2YyAE0v1QExE1c8S+woPmoq0GJ4gDx2XCdO0lYKTQploi+4EY5rJ4udhsvtbXjTqnAQnt5gJBqeiSMVbXpPlmPRBu5MqTm6RmiB8RYItM3nCvows85L1TK0vZvWEAyIYz2omuXUXx4YXEuUMGs9KfxKyRb+7DabxTFa01njIRIVbXwsJwcCukN7FQkWB7SLBNtZnOiaprCxaaLxEQuKFTNTZOpLNHfZhJw9ebiETuFM766NdXwXkLEBZzBRva2lt3/iWgk6+q7tNHNDVmj40MYGLB9tapA09HjCZkdQUQE086qpj72PwcF4QI4fbYbJ1hsHJa4ImSei0JLOOGNM6OJZ0FYPp2nNx4uTExRPGG8V8UawnmPPKMkl9qyLwlexLdac2fyG3L7SVNTGB7jGjxgR7X8HPSfJdhKtNTPZgm2vae8eLu5jIVxbtxaK9Rij8q4q9qI0IDG0EXdzXnjtBChWmYDhliJkSGZWIVNS/twxVxO+PUEgkSHrIheQpK7fpTiRdUXhBMrUcGbL0eL/rIHF3Re0yNFo9GGju1PYTJb0BQQEfNTRtXpTBJxqJJIcjirmBgJogOrX92E3HeBGMJxmjnixnIw39XwodU1ne1FmCN8mRdk1HBp5Z3qQnCWzXWMXuuGhuIMCUibb/2I271ydneckwdkN/mmqs4i57VjA3ELC6Bb/f7cRooFcMTIKw1aCfdlFZwdhAeB4igQXPATkwGgim7oG3N+innZEsdE283mSz2YgVT0y5SMvTXTUxrWR9Df4mhSO+BUV5Pd5C7mTJT693jmcUvR8GH1cabjvuIKUoWqNNqK0uaMkDeG4wniBXPUriFdHfoAFczoiSqzLxclaMWvJYGVQchR6B14wnCbxiDzYaih1RIScZmOxDlpgOFDU0gV6hQkmCokQa/nEhT9Cey1X7OlmOWPWz667eqCDIlXgg5YTGe1HoXqpM0OrEqNNmkXiGioqseVQilysONd6LOqLSTqKaDNqHLHvE1HY4og7zUHKKL+xpxu5EUcRymWivZUjoFhj7CJSSGe9owil6o3xOy7tEKmzlg6/OqJQjw6NcbmdrqJmaHVPTO7ieFAwohPpcFjK5g91r6uKN1bXu5vLpsdVKwWV/p81K6Z/aUaHW1i7HmiqJCyzUgt1Bl6VMtqOjO1rVY83V7I4vrZFyq6P9Noula3QdV7VIo7GmC+Japp3u0ZjLaiYXQq09CjTdibqDE8A0MR5022yfA2opEmy+OTumutffjvd5bJ9BXLG4v6XM9Wh8yn/4syDh8g1Pa/p3e/4/TuLTEgCPyCuL6IwIGgAAAABJRU5ErkJggg==">
        <img v-show="open_step === 2" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAADuCAMAAACJQ/wDAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAMAUExURUxpcdTRz9zNwue4c9vFrKSTm9m4oNfQzdjMxtfBtcrGxcJbZee8itmgRu+4VuO6i4SKnK2osNLLwd26kS0+abt1emJbWPLRddOZfJOTmNKZctvRyd+6cMpsdbVeZVNXZ8mMNum0bHFzfaCDTCMvUeq4YeClf9+tj9StYmlugEFKYk1TZseiW9fUz4AMFZWVmX0OF/CkW5seKawqNtCNa8mXR9SsryAtUjZCZXRvc4wsM8+Lj5lETMBDUbMZKVJNTSYgHx0dOLQ3QhYRGJAbJzIuMwkWJuuHiJ8XJGoID+q8nJYUH/////LHqe7Aoui4l+Kuiu/DpHEJEfDFpuSxjm0JEJgUIPbQsggVJPXMr/3LaOTw8fO+VXgLE4cRGnQLE+2/n/PKrHoMFuWzkRMjS/fAWd3u8Q8fQeCqhicTD/C7T38OF4MPGPnVtA0cOQoXKy4XEvrHYue1lIsRG5wXI5MRHO20Ro8SHfnFXO/3+Pr9/unz9OTf3/vUZPP7/A0DAvzmgQwZMfnbdcro8d7c3OefMPrdtv3Za/i8UO2uPgIAAfHGXf3qvuqlNtrW1vvhexYnVQcTIDcdFuvp6fbTbvvkueWYKvK2SfTOZtTr8JAED+fk5P/xxEQkHMLl7/3sivDv7umpPKUeKJgHE50PGx4uYNjy/NpyZv/cvAMROfb29duhfuX4/q8gKgEIIei3WA8JDNaYc82JZm0bMduVLP/nx+WtTv70lB0IBe/12NTl5PHcreN0dMfV2uHHiuCeNS8kIX0UKFUzIPDux+nz4eGNHT8yKqcNGtaCF7Xo+4MACLnL08Tt/LFAQfPRp9qJa1k9PHaFmmdWPV4GDOrDbIBrS/firzohOJysuKGEe4aVoJCgqjQfQ+fVp7CUh4p3aKW2wrDBzNq8tuDn6s2qm8Cnd8WScsKokNK4oeync+jexsJ5f+DIw727uc+3e9/IrLXZ5LBiOuzZurCXXMN5Wuh+gbenp1lslOrNsj5TgUg/OXRKH4qZuf/o4e7ZkS1Df07HvuEAAAD/dFJOUwD8H3o7Q00JFC78iZf+3166KZlx+lX+/5lhu2X+af2y/Kmu/t3I1sL+cMaN/cD0j+L+4tfg2f313fb+/v6r7vzi/Mfz+8D//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////KI1F88AACAASURBVHjavJhPaCJ5Fse7o5s/TVQmgZXt9hARmRyS45z3MMxl8bKwJ63bUmHjSS9S0VQszEiVFnZBp9AKIVEvOUig+hBMGGgTXAxp8BBED83SE5Ym9BJ6090TmEOEsO/96o9lumftZGJ/DaaqrJf38fv7vff7VR48uL2ePCzNT9w2aKq0PDX+4KvoyUYgUJq6ZZD9IQTNj38tvsDa1K1dh6jK1/AQ+eK3B7Q/CsTjX4PwyVMwohLYuAE4MjrZ0/TEyNinczAQr8QDpSdD5hufrwBfJbDcA7S7XC6b31ntSXX6J+Gia+ImIBDO24cLOLoRqJRKlfjDUQ1u0ut1lg8Odvt1gCpXnV6vzYSciscxsDI1VL6xqQqkKVUq2GZGXJMaXOP4phoGZ9lvm7aT8Z6qVDAyPtxKnt6Il9bWSisrj76d9PoBjrDtol0wskRwQKh1TPjI6Z0GxKlQBUMra0OdhVOllbW1xE7i3AMUQNfYBTRVlFNcsVjcIyoWOSnlVkSV3NEgPjq809PfvllJrCHho9FhjnCp9GZn57xWTecbBE5McXt7BhnRnnnOyWIMIYmN5epf1xKhtY21padDnIX2h4nQwvL7KtDlD8phRSoa4lASiJPwqOenW8wc5AExnS573i9vL2yUlocIOPrjzsI7NQ146Zgi6Uypz4ig6pTFFFVO5/NpQPzb0zcLoY1hOvjT2l+qgJcLy8CQkmVFUWRDiilySjDBS8KoxDREx99/3E7MjwyviN97DhqNHAXZZUX8bSmihpnSjEREGRDT6fzBP94tPxxWr7Z7Z2H2pREP6CgqbIgK947xFEQwFfTRsBEQYWLEyg7VM6QytjspcCGmIB4CxX5DJqbBSBCBUQrDzBVz6Zh3GL16fNIJrS0mpiQZ+QAkE8vgz03BdZMTIYHR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">
      </div>
      <div class="success-submit" v-show="open_step === 1">
        <span class="success-submit-status">开户申请已提交</span>
        <p class="success-submit-description">亲，我们将在<span class="red-word">1-3个交易日</span>内短信通知您开户结果。您可以使用“账户”-&gt;“查询开户进度”中查询您的开户结果。</p>
      </div>
      <div class="fail-submit" v-show="open_step === 2">
        <span class="fail-submit-status">开户申请提交失败！</span>
        <p class="fail-submit-description">您提交的资料可能不完整,请重新进入开户，补充完整后再次提交审核!</p>
      </div>
    </div>
    <div class="open-status" v-show="open_step === 3">
      <h2 class="title">{{openResult.title}}</h2>
      <v-tip :content="tipcontent" style="text-align:center;"></v-tip>
      <div class="tableMsg">
        <table>
          <tr>
            <td>客户姓名</td>
            <td id="nameTr" colspan="2">{{openResult.name}}</td>
          </tr>
          <tr>
            <td>资金账户</td>
            <td id="moneyTr">{{openResult.account}}<span class="copy" v-if="is_show_copy" @click="copyAccount">复制</span></td>
          </tr>
          <tr>
            <td>三方存管</td>
            <td id="bankTr" colspan="2">{{openResult.third_party}}</td>
          </tr>
          <tr v-if="is_show_branch">
            <td>营业部</td>
            <td id="saleTr" colspan="2">{{openResult.branch_name}}</td>
          </tr>
        </table>
      </div>
      <div class="tel-box" @click = "call">
        <v-nextstep :next="nextstep.next" :text="nextstep.text"></v-nextstep>
        <a @click="doNothing" :href="tel_href" v-if="is_can_call"></a>
      </div>

    </div>
    <v-mask @hide="closeAlertBox" :is_show="alertbox.show"></v-mask>
    <div class="middle-center">
      <v-alertbox :content="alertbox.content" v-if="alertbox.show" @closeAlertBox="closeAlertBox"></v-alertbox>
    </div>
    <v-indicator v-if="is_show_indicator"></v-indicator>
  </div>
</template>

<script>
  import Nextstep from '../component/NextStep.vue'
  import Tip from '../component/Tip.vue'
  import Alertbox from '../component/AlertBox'
  import Mask from '../component/Mask'
  import Indicator from '../component/Indicator'
  import bus from '../../bus'
  import config from '../../config'
  import axios from 'axios'
  
  import tools from '../../tools'
  import certinstall from '../page/CertInstall'

  export default {
    name: 'openaccountresult',
    data() {
      return {
        title: '申请提交',
        nextstep: {
          next: true,
          text: '拨打客服电话'
        },
        tel_href: '',
        tipcontent: '',
        open_step: 1,
        is_show_branch: false,
        is_show_indicator: false,
        is_show_copy: false,
        is_can_call:true,
        openResult: {
          title: '',
          name: '',
          account: '',
          third_party: '',
          branch_name: ''
        },
        alertbox: {
          content: [],
          show: false,
        }
      }
    },
    components: {
      'v-tip': Tip,
      'v-nextstep': Nextstep,
      'v-mask': Mask,
      'v-alertbox': Alertbox,
      'v-indicator': Indicator
    },
    methods: {
      copyAccount: function () {
        var self = this;
        callNativeHandler('khh5', {
          "action": "copy",
          "reqId": "copy",
          "param": {
            "content": self.openResult.account
          }
        }, function (data) {
          if (typeof data == 'string') {
            data = JSON.parse(data);
          }
          if (data.param.errorNo == '0') {
            self.alertbox.content = ['复制成功'];
          } else {
            self.alertbox.content = [data.param.errorInfo];
          }
          self.alertbox.show = true;
        });
      },
      closeAlertBox: function () {
        this.alertbox.show = false;
      },
      openAccountResult: function () {
        var self = this;
        axios.get(config.qsInterface + 'openaccountresult').then(function (response) {
          if (response.data.error_no == 0) {
            var fundAccount = response.data.fund_account;
            var bankAccount = response.data.bank_account;
            var nextAuditDate = response.data.next_audit_date;
            var thirdUrl = response.data.third_url;
            var auditStatus = self.compareTime(nextAuditDate);
            self.openResult.name = JSON.parse(localStorage.getItem('registerInfo')).client_name;
            if (fundAccount.fund_account) {
              self.is_show_copy = true;
              self.openResult.account = fundAccount.fund_account;
              self.openResult.title = '审核通过';
              self.tipcontent = '您的开户申请已通过。';
            } else {
              if (fundAccount.open_status == 1) {
                self.openResult.account = '已受理';
              } else {
                self.openResult.account = '受理中'
              }
            }

            if (bankAccount.length == 0) {
              self.openResult.third_party = '受理中';
            } else if (!response.data.bank_account[0].bank_account) {
              self.openResult.third_party = '受理中';
            }
            var bankItem = self.getBankItem(response.data.bank_account[0].bank_no);
            if (bankItem) {
              var bankName = bankItem['bank_name'];
            }
            if (bankName) {
              self.openResult.third_party = bankName;
            } else {
              var openStatus = bankAccount[0].open_status;
              if (openStatus == 0) {
                self.openResult.third_party = '受理中';
              } else if (openStatus == 1) {
                self.openResult.third_party = '已受理';
              } else if (openStatus == 2) {
                self.openResult.third_party = '受理失败';
              } else if (openStatus == 3) {
                self.openResult.third_party = '数据异常';
              }
            }

            if (response.data.branch_name != '') {
              self.openResult.branch_name = response.data.branch_name;
              self.is_show_branch = true;
            }

            var auditPass = false;
            if (fundAccount.open_status == '1' && bankAccount[0].open_status == '1') {
              auditPass = true;
            }
            if (!auditPass) {
              if (auditStatus) {
                self.openResult.title = '正在审核中';
                self.tipcontent = '您的开户申请正在审核中。';
              } else {
                self.openResult.title = '审核超时';
                self.tipcontent = '审核已超时，请拨打客服热线  您的开户资料审核已超过最长审核时间3个交易日，请致证券公司客服。';
              }
            }
          } else {
            self.alertbox.content = [response.data.error_info];
            self.alertbox.show = true;
          }
        }).catch(function (error) {
          self.alertbox.content = ['获取开户结果失败'];
          self.alertbox.show = true;
        });
      },
       call:function(){
        var self = this;
        this.is_can_call = false;
        setTimeout(function(){
          self.is_can_call = true;
        },1000);
      },
      compareTime: function (nextAuditDate) {
        var nextAuditTime = new Date(nextAuditDate).getTime();
        //当前时间
        var myDate = new Date().getTime();
        if (myDate < nextAuditTime) {
          return true;
        } else {
          return false;
        }
      },
      getBankItem: function (bankNo) {
        //获取缓存银行数据
        var bankList = JSON.parse(localStorage.getItem("bankList"));
        for (var i = 0; i < bankList.length; i++) {
          var bankItem = bankList[i];
          if (bankNo == bankItem.bank_no) return bankItem;
        }
      },
      doNothing: function(){
        return false
      }
    },
    created: function () {
      this.tel_href = 'tel:' + JSON.parse(localStorage.getItem('qsDetail')).qs_hotline;
      if (localStorage.getItem('success') == 'success') {
        this.open_step = 3;
        this.title = '进度查询';
        localStorage.removeItem('success');
        this.openAccountResult();
        var self = this;
	    axios.get(config.qsInterface + 'openaccountapply').then(function (response) {
	        self.is_show_indicator = false;
	    }).catch(function (error) {
	        self.is_show_indicator = false;
	        self.alertbox.content = ['发送开户申请失败'];
	        self.alertbox.show = true;
	    });
      } else {
        this.is_show_indicator = true;
        this.title = '申请提交';
        if (localStorage.getItem('thirdParty') == 'true') {
          this.open_step = 1;
          this.is_show_indicator = false;
        } else {
          var self = this;
          axios.get(config.qsInterface + 'openaccountapply').then(function (response) {
            self.is_show_indicator = false;
            if (response.data.error_no == '0' || response.data.error_no == '-3') {
              self.open_step = 1;
              tools.stepSync('OpenAccountApply');
            } else {
              self.open_step = 2;
            }
          }).catch(function (error) {
            self.is_show_indicator = false;
            self.alertbox.content = ['发送开户申请失败'];
            self.alertbox.show = true;
          });
        }
      }
      bus.$emit('titleName', this.title, 14);
    }
  }

</script>

<style>
  .success-submit .success-submit-status,
  .fail-submit .fail-submit-status {
    display: block;
    width: 100%;
    text-align: center;
    line-height: 0.8rem;
    font-size: 0.4rem;
    color: #3a83d7;
    margin-top: 0.2rem;
  }

  .success-submit-description,
  .fail-submit-description {
    text-indent: 0.8rem;
    color: #666;
    line-height: 0.56rem;
    font-size: 0.4rem;
    padding: 0 0.3rem;
  }

  .red-word {
    color: #f64d54;
  }

  .tableMsg {
    width: 6.9rem;
    text-align: center;
    border: 1px solid #d7d7d7;
    border-radius: 0.1rem;
    background-color: #fff;
    border-bottom: none;
    margin: 0.3rem 0.3rem 0;
    font-size: 0.4rem;
  }

  table {
    width: 100%;
    height: 100%;
    color: #333;
  }

  table tr td:first-child {
    border-right: 1px solid #d7d7d7;
    width: 40%;
  }

  table tr td {
    padding: 0.2rem 0;
    font-size: 0.28rem;
  }

  table tr {
    border-bottom: 1px solid #d7d7d7;
  }

  .open-status .title {
    font-size: 0.4rem;
    text-align: center;
  }

  #moneyTr {
    position: relative;
  }

  .copy {
    color: #fff;
    background-color: #3a83d7;
    height: 20px;
    font-size: 0.24rem;
    margin-right: 5px;
    border-radius: 5px;
    position: absolute;
    right: 3px;
    top: 50%;
    line-height: 20px;
    padding: 2px 4px;
    transform: translateY(-50%);
  }

  .tel-box {
    position: relative;
  }

  .tel-box a {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

</style>
