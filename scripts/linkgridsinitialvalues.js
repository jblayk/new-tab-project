const initialQuickLinksData = [
  {
    "name": "Folding@Home",
    "url": "https://v8-4.foldingathome.org/machines",
    "icon": "https://foldingathome.org/wp-content/uploads/2016/09/folding-at-home-logo.png",
    "invert": false
  },
  {
    "name": "Facebook",
    "url": "https://www.facebook.com/",
    "icon": "https://upload.wikimedia.org/wikipedia/commons/6/6c/Facebook_Logo_2023.png",
    "invert": false
  },
  {
    "name": "Instagram",
    "url": "https://www.instagram.com/",
    "icon": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/1200px-Instagram_logo_2022.svg.png",
    "invert": false
  },
  {
    "name": "TikTok",
    "url": "https://www.tiktok.com/",
    "icon": "https://upload.wikimedia.org/wikipedia/commons/a/a6/Tiktok_icon.svg",
    "invert": false
  },
  {
    "name": "Messages",
    "url": "https://messages.google.com/",
    "icon": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Google_Messages_icon_%282022%29.svg/2048px-Google_Messages_icon_%282022%29.svg.png",
    "invert": false
  },
  {
    "name": "Reddit",
    "url": "https://www.reddit.com",
    "icon": "https://brandlogos.net/wp-content/uploads/2024/04/reddit_symbol_alternative-logo_brandlogos.net_scgic.png",
    "invert": false
  },
  {
    "name": "Universal Credit",
    "url": "https://www.universal-credit.service.gov.uk/sign-in",
    "icon": "https://www.svgrepo.com/show/341873/gov-uk.svg",
    "invert": true
  },
  {
    "name": "Weather",
    "url": "https://www.accuweather.com/en/gb/ivybridge/pl21-9/weather-forecast/327630",
    "icon": "https://img.icons8.com/?size=512&id=QMpOneRGvpws&format=png",
    "invert": false
  },
  {
    "name": "ChatGPT",
    "url": "https://chatgpt.com/",
    "icon": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/ChatGPT-Logo.svg/1024px-ChatGPT-Logo.svg.png",
    "invert": true
  },
  {
    "name": "Gemini",
    "url": "https://gemini.google.com/",
    "icon": "https://registry.npmmirror.com/@lobehub/icons-static-png/1.74.0/files/dark/gemini-color.png",
    "invert": false
  },
  {
    "name": "Plex",
    "url": "http://127.0.0.1:32400/web/index.html",
    "icon": "https://wiki.mrmc.tv/images/c/cf/Plex_icon.png",
    "invert": false
  },
  {
    "name": "Duolingo",
    "url": "https://www.duolingo.com/learn",
    "icon": "https://design.duolingo.com/86230c9ad10d9f08b785.svg",
    "invert": false
  },
  {
    "name": "Amazon",
    "url": "https://www.amazon.co.uk/",
    "icon": "https://images.icon-icons.com/2429/PNG/512/amazon_logo_icon_147320.png",
    "invert": false
  },
  {
    "name": "D&D Beyond",
    "url": "https://www.dndbeyond.com/characters",
    "icon": "https://img.icons8.com/color/512/dungeons-and-dragons.png",
    "invert": false
  },
  {
    "name": "5e Tools",
    "url": "https://5e.tools/",
    "icon": "https://5e.tools/favicon.svg",
    "invert": false
  },
  {
    "name": "Owlbear Rodeo",
    "url": "https://www.owlbear.rodeo/",
    "icon": "https://docs.owlbear.rodeo/img/logo.svg",
    "invert": false
  },
  {
    "name": "Inkarnate",
    "url": "https://inkarnate.com/",
    "icon": "https://images.squarespace-cdn.com/content/v1/5d93b44c542e4e299451cbdb/1571850510941-MM7NRHMG7F34KYGJEWJQ/Inkarnate+-+Logo.png",
    "invert": false
  },
  {
    "name": "Rossmail",
    "url": "http://www.rossmail.me/",
    "icon": "https://www.rossmail.me/assets/pwa-icon-512x512-cvsbrez2.png",
    "invert": false
  },
  {
    "name": "W3Schools",
    "url": "https://www.w3schools.com/",
    "icon": "https://avatars.githubusercontent.com/u/77673807",
    "invert": false
  },
  {
    "name": "Codecademy",
    "url": "https://www.codecademy.com/",
    "icon": "https://assets.bitdegree.org/online-learning-platforms/storage/media/codecademy-5f60af13ae6d0.o.png",
    "invert": true
  },
  {
    "name": "Mozilla Developer Network",
    "url": "https://developer.mozilla.org/",
    "icon": "https://www.svgrepo.com/show/443263/brand-mozilla-developer-network.svg",
    "invert": true
  },
  {
    "name": "GeeksforGeeks",
    "url": "https://www.geeksforgeeks.org/",
    "icon": "https://geeksforgeeks.zohorecruit.in/recruit/viewCareerImage.do?page_id=61093000000211152&type=logo&file_name=GG_Logo.png",
    "invert": false
  },
  {
    "name": "Netflix",
    "url": "http://www.netflix.com",
    "icon": "https://upload.wikimedia.org/wikipedia/commons/0/03/Netflix-icon.png?20250728101151",
    "invert": false
  },
  {
    "name": "Disney Plus",
    "url": "http://www.disneyplus.com",
    "icon": "https://upload.wikimedia.org/wikipedia/commons/f/fa/Disney_plus_icon.png",
    "invert": false
  },
  {
    "name": "Prime Video",
    "url": "https://www.amazon.co.uk/gp/video/storefront",
    "icon": "https://img.icons8.com/?size=512&id=Rs68BrhxH0XZ&format=png",
    "invert": false
  },
  {
    "name": "Twitch",
    "url": "https://www.twitch.tv/",
    "icon": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Twitch_Glitch_Logo_Purple.svg/1756px-Twitch_Glitch_Logo_Purple.svg.png",
    "invert": false
  },
  {
    "name": "DM Screen",
    "url": "https://5e.tools/dmscreen.html#%7B%22w%22%3A7%2C%22h%22%3A3%2C%22ctc%22%3Atrue%2C%22fs%22%3Atrue%2C%22lk%22%3Atrue%2C%22ps%22%3A%5B%7B%22x%22%3A6%2C%22y%22%3A0%2C%22w%22%3A1%2C%22h%22%3A1%2C%22t%22%3A0%7D%2C%7B%22x%22%3A0%2C%22y%22%3A0%2C%22w%22%3A1%2C%22h%22%3A3%2C%22t%22%3A1%2C%22c%22%3A%7B%22p%22%3A%22tables.html%22%2C%22s%22%3A%22XGE%22%2C%22u%22%3A%22mountain%2520encounters%2520(levels%25201%25e2%2580%25944)_xge%22%7D%2C%22a%22%3A%5B%7B%22t%22%3A1%2C%22c%22%3A%7B%22p%22%3A%22tables.html%22%2C%22s%22%3A%22XGE%22%2C%22u%22%3A%22forest%2520encounters%2520(levels%25201%25e2%2580%25944)_xge%22%7D%7D%2C%7B%22t%22%3A1%2C%22c%22%3A%7B%22p%22%3A%22tables.html%22%2C%22s%22%3A%22XGE%22%2C%22u%22%3A%22grassland%2520encounters%2520(levels%25201%25e2%2580%25945)_xge%22%7D%7D%2C%7B%22t%22%3A1%2C%22c%22%3A%7B%22p%22%3A%22tables.html%22%2C%22s%22%3A%22XGE%22%2C%22u%22%3A%22hill%2520encounters%2520(levels%25201%25e2%2580%25944)_xge%22%7D%7D%2C%7B%22t%22%3A1%2C%22c%22%3A%7B%22p%22%3A%22tables.html%22%2C%22s%22%3A%22XGE%22%2C%22u%22%3A%22urban%2520encounters%2520(levels%25201%25e2%2580%25944)_xge%22%7D%7D%2C%7B%22t%22%3A1%2C%22c%22%3A%7B%22p%22%3A%22tables.html%22%2C%22s%22%3A%22FRAiF%22%2C%22u%22%3A%22wilderness%2520encounters_fraif%22%7D%7D%2C%7B%22t%22%3A1%2C%22c%22%3A%7B%22p%22%3A%22tables.html%22%2C%22s%22%3A%22XGE%22%2C%22u%22%3A%22mountain%2520encounters%2520(levels%25201%25e2%2580%25944)_xge%22%7D%7D%5D%2C%22b%22%3A5%7D%2C%7B%22x%22%3A2%2C%22y%22%3A0%2C%22w%22%3A1%2C%22h%22%3A1%2C%22t%22%3A1%2C%22c%22%3A%7B%22p%22%3A%22tables.html%22%2C%22s%22%3A%22XGE%22%2C%22u%22%3A%22supplemental%2520tables%253b%2520race_xge%22%7D%7D%2C%7B%22x%22%3A2%2C%22y%22%3A1%2C%22w%22%3A1%2C%22h%22%3A1%2C%22t%22%3A1%2C%22c%22%3A%7B%22p%22%3A%22tables.html%22%2C%22s%22%3A%22XDMG%22%2C%22u%22%3A%221%253a%2520common%2520names_xdmg%22%7D%7D%2C%7B%22x%22%3A5%2C%22y%22%3A2%2C%22w%22%3A2%2C%22h%22%3A1%2C%22t%22%3A0%7D%2C%7B%22x%22%3A1%2C%22y%22%3A0%2C%22w%22%3A1%2C%22h%22%3A1%2C%22t%22%3A2%7D%2C%7B%22x%22%3A1%2C%22y%22%3A1%2C%22w%22%3A1%2C%22h%22%3A1%2C%22t%22%3A8%2C%22s%22%3A%7B%22state%22%3A%7B%22time%22%3A21908013%2C%22browseTime%22%3Anull%2C%22isBrowseMode%22%3Afalse%2C%22hoursPerDay%22%3A24%2C%22minutesPerHour%22%3A60%2C%22secondsPerMinute%22%3A60%2C%22hoursPerLongRest%22%3A8%2C%22minutesPerShortRest%22%3A60%2C%22secondsPerRound%22%3A6%2C%22offsetYears%22%3A0%2C%22offsetMonthStartDay%22%3A0%2C%22days%22%3A%5B%7B%22id%22%3A%2214f40248-cc42-4db3-8ce2-efaab7ebe9c9%22%2C%22data%22%3A%7B%22name%22%3A%22Moonday%22%7D%7D%2C%7B%22id%22%3A%22088a8716-977b-417f-87a7-64a37477c2f2%22%2C%22data%22%3A%7B%22name%22%3A%22Godsday%22%7D%7D%2C%7B%22id%22%3A%222058301f-7573-4bef-b144-f895071bb853%22%2C%22data%22%3A%7B%22name%22%3A%22Waterday%22%7D%7D%2C%7B%22id%22%3A%222bccc083-6f04-4c89-8f01-12a7ebd4ad52%22%2C%22data%22%3A%7B%22name%22%3A%22Earthday%22%7D%7D%2C%7B%22id%22%3A%2285de5f06-5fe9-49f9-8495-b484f551202a%22%2C%22data%22%3A%7B%22name%22%3A%22Freeday%22%7D%7D%2C%7B%22id%22%3A%2212f5ef70-95d4-4c9b-aa35-20733721f8ef%22%2C%22data%22%3A%7B%22name%22%3A%22Starday%22%7D%7D%2C%7B%22id%22%3A%22f6f2e42d-2afb-446d-9123-a4b02db90e46%22%2C%22data%22%3A%7B%22name%22%3A%22Sunday%22%7D%7D%5D%2C%22months%22%3A%5B%7B%22id%22%3A%22f2cf1520-3a0c-4234-a7bf-ef65fb2b58ed%22%2C%22data%22%3A%7B%22name%22%3A%22Hammer%2FDeepwinter%22%2C%22days%22%3A30%7D%7D%2C%7B%22id%22%3A%225ccfce93-3bda-430a-888d-3f873ff669e5%22%2C%22data%22%3A%7B%22name%22%3A%22Alturiak%22%2C%22days%22%3A30%7D%7D%2C%7B%22id%22%3A%22e5f1bc19-cacf-4053-9319-2bbf12b88647%22%2C%22data%22%3A%7B%22name%22%3A%22Ches%22%2C%22days%22%3A30%7D%7D%2C%7B%22id%22%3A%2269953601-34d9-444f-ac6a-6685306e7f01%22%2C%22data%22%3A%7B%22name%22%3A%22Tarsahk%22%2C%22days%22%3A30%7D%7D%2C%7B%22id%22%3A%22b5b5131c-dcb2-4802-9a70-6a0a86d4d57f%22%2C%22data%22%3A%7B%22name%22%3A%22Mirtul%22%2C%22days%22%3A30%7D%7D%2C%7B%22id%22%3A%2288ac1631-5ccf-40bb-987f-debf6b593455%22%2C%22data%22%3A%7B%22name%22%3A%22Kythorn%22%2C%22days%22%3A30%7D%7D%2C%7B%22id%22%3A%229adaca41-17bd-42be-8135-4023ce04455f%22%2C%22data%22%3A%7B%22name%22%3A%22Flamerule%22%2C%22days%22%3A30%7D%7D%2C%7B%22id%22%3A%22c1408d14-d1bd-41cc-a6ee-0dc542722b77%22%2C%22data%22%3A%7B%22name%22%3A%22Eleasis%22%2C%22days%22%3A30%7D%7D%2C%7B%22id%22%3A%221726bf1e-7df8-47c4-80d5-5d894a6fa1e5%22%2C%22data%22%3A%7B%22name%22%3A%22Elient%22%2C%22days%22%3A30%7D%7D%2C%7B%22id%22%3A%22b9f5ee5b-88c3-4322-815c-f4ae70a732af%22%2C%22data%22%3A%7B%22name%22%3A%22Marpenoth%22%2C%22days%22%3A30%7D%7D%2C%7B%22id%22%3A%225d02f98f-27d1-4715-960c-c4e4b2d23b2e%22%2C%22data%22%3A%7B%22name%22%3A%22Uktar%22%2C%22days%22%3A30%7D%7D%2C%7B%22id%22%3A%2249b1c0a9-9916-4fd1-9dac-f439d3743f06%22%2C%22data%22%3A%7B%22name%22%3A%22Nightal%22%2C%22days%22%3A30%7D%7D%5D%2C%22events%22%3A%7B%7D%2C%22encounters%22%3A%7B%7D%2C%22seasons%22%3A%5B%7B%22id%22%3A%227a319827-11ad-4473-8e4c-613619701bd2%22%2C%22data%22%3A%7B%22name%22%3A%22Winter%22%2C%22startDay%22%3A0%2C%22endDay%22%3A89%2C%22sunriseHour%22%3A6%2C%22sunsetHour%22%3A22%7D%7D%2C%7B%22id%22%3A%223d6e1cbe-5a1a-4a1e-bc7a-a2f7037cc949%22%2C%22data%22%3A%7B%22name%22%3A%22Spring%22%2C%22startDay%22%3A90%2C%22endDay%22%3A179%2C%22sunriseHour%22%3A6%2C%22sunsetHour%22%3A22%7D%7D%2C%7B%22id%22%3A%222dffe78c-4b79-40de-b49b-f5ec26a673b4%22%2C%22data%22%3A%7B%22name%22%3A%22Summer%22%2C%22startDay%22%3A180%2C%22endDay%22%3A269%2C%22sunriseHour%22%3A6%2C%22sunsetHour%22%3A22%7D%7D%2C%7B%22id%22%3A%22f858f41a-f46c-4a4e-8fec-4e14403322e0%22%2C%22data%22%3A%7B%22name%22%3A%22Harvesttide%22%2C%22startDay%22%3A270%2C%22endDay%22%3A359%2C%22sunriseHour%22%3A6%2C%22sunsetHour%22%3A22%7D%7D%5D%2C%22years%22%3A%5B%5D%2C%22eras%22%3A%5B%5D%2C%22moons%22%3A%5B%7B%22id%22%3A%22654e3662-60e4-4611-a71b-d58de67057dd%22%2C%22data%22%3A%7B%22name%22%3A%22Moon%201%22%2C%22color%22%3A%22%23ffffff%22%2C%22phaseOffset%22%3A0%2C%22period%22%3A24%7D%7D%5D%2C%22tab%22%3A0%2C%22isPaused%22%3Atrue%2C%22isAutoPaused%22%3Afalse%2C%22hasCalendarLabelsColumns%22%3Atrue%2C%22hasCalendarLabelsRows%22%3Afalse%2C%22unitsWindSpeed%22%3A%22mph%22%2C%22isClockSectionHidden%22%3Afalse%2C%22isCalendarSectionHidden%22%3Afalse%2C%22isMechanicsSectionHidden%22%3Afalse%2C%22isOffsetsSectionHidden%22%3Afalse%2C%22isDaysSectionHidden%22%3Afalse%2C%22isMonthsSectionHidden%22%3Afalse%2C%22isSeasonsSectionHidden%22%3Afalse%2C%22isYearsSectionHidden%22%3Afalse%2C%22isErasSectionHidden%22%3Afalse%2C%22isMoonsSectionHidden%22%3Afalse%7D%2C%22compClockState%22%3A%7B%22state%22%3A%7B%7D%2C%22compWeatherState%22%3A%7B%22state%22%3A%7B%22temperature%22%3A%22cold%22%2C%22precipitation%22%3A%22hail%22%2C%22windDirection%22%3A-9%2C%22windSpeed%22%3A%22calm%22%7D%7D%7D%2C%22compCalendarState%22%3A%7B%22state%22%3A%7B%7D%7D%2C%22compSettingsState%22%3A%7B%22state%22%3A%7B%7D%7D%7D%7D%2C%7B%22x%22%3A1%2C%22y%22%3A2%2C%22w%22%3A2%2C%22h%22%3A1%2C%22t%22%3A1%2C%22c%22%3A%7B%22p%22%3A%22spells.html%22%2C%22s%22%3A%22XPHB%22%2C%22u%22%3A%22teleport_xphb%22%7D%7D%2C%7B%22x%22%3A3%2C%22y%22%3A0%2C%22w%22%3A2%2C%22h%22%3A3%2C%22t%22%3A5%2C%22s%22%3A%7B%22s%22%3A%22NUMBER%22%2C%22d%22%3A%22DESC%22%2C%22ri%22%3Atrue%2C%22m%22%3Afalse%2C%22rg%22%3Afalse%2C%22rri%22%3Afalse%2C%22wId%22%3Afalse%2C%22g%22%3Atrue%2C%22p%22%3Atrue%2C%22a%22%3Afalse%2C%22k%22%3Afalse%2C%22piHp%22%3Afalse%2C%22piHm%22%3Afalse%2C%22piV%22%3Atrue%2C%22piO%22%3Afalse%2C%22c%22%3A%5B%5D%2C%22cndc%22%3A%5B%5D%2C%22r%22%3A%5B%5D%2C%22rdp%22%3A%5B%5D%2C%22n%22%3A2%7D%7D%2C%7B%22x%22%3A5%2C%22y%22%3A1%2C%22w%22%3A1%2C%22h%22%3A1%2C%22t%22%3A0%7D%2C%7B%22x%22%3A6%2C%22y%22%3A1%2C%22w%22%3A1%2C%22h%22%3A1%2C%22t%22%3A0%7D%2C%7B%22x%22%3A5%2C%22y%22%3A0%2C%22w%22%3A1%2C%22h%22%3A1%2C%22t%22%3A0%7D%5D%2C%22ex%22%3A%5B%7B%22x%22%3A5%2C%22y%22%3A0%2C%22w%22%3A1%2C%22h%22%3A1%2C%22t%22%3A51%2C%22s%22%3A%7B%7D%7D%2C%7B%22x%22%3A5%2C%22y%22%3A1%2C%22w%22%3A1%2C%22h%22%3A1%2C%22t%22%3A1%2C%22c%22%3A%7B%22p%22%3A%22card%22%2C%22s%22%3A%22HFDoMM%22%2C%22u%22%3A%22waterdeep%2520charcuterie_deck%2520of%2520many%2520morsels_hfdomm%22%7D%7D%2C%7B%22x%22%3A3%2C%22y%22%3A1%2C%22w%22%3A2%2C%22h%22%3A2%2C%22t%22%3A1%2C%22c%22%3A%7B%22p%22%3A%22tables.html%22%2C%22s%22%3A%22XDMG%22%2C%22u%22%3A%22npc%2520appearance_xdmg%22%7D%7D%2C%7B%22x%22%3A3%2C%22y%22%3A0%2C%22w%22%3A2%2C%22h%22%3A1%2C%22t%22%3A1%2C%22c%22%3A%7B%22p%22%3A%22tables.html%22%2C%22s%22%3A%22XDMG%22%2C%22u%22%3A%22months%2520and%2520festivals%253b%2520days%2520of%2520the%2520week_xdmg%22%7D%7D%2C%7B%22x%22%3A3%2C%22y%22%3A1%2C%22w%22%3A2%2C%22h%22%3A2%2C%22t%22%3A1%2C%22c%22%3A%7B%22p%22%3A%22tables.html%22%2C%22s%22%3A%22SCAG%22%2C%22u%22%3A%22the%2520shifting%2520of%2520the%2520seasons%253b%2520the%2520calendar%2520of%2520harptos_scag%22%7D%7D%2C%7B%22x%22%3A3%2C%22y%22%3A1%2C%22w%22%3A2%2C%22h%22%3A2%2C%22t%22%3A1%2C%22c%22%3A%7B%22p%22%3A%22tables.html%22%2C%22s%22%3A%22SCAG%22%2C%22u%22%3A%22the%2520shifting%2520of%2520the%2520seasons%253b%2520the%2520calendar%2520of%2520harptos_scag%22%7D%7D%2C%7B%22x%22%3A2%2C%22y%22%3A0%2C%22w%22%3A1%2C%22h%22%3A1%2C%22t%22%3A1%2C%22c%22%3A%7B%22p%22%3A%22variantrules.html%22%2C%22s%22%3A%22XPHB%22%2C%22u%22%3A%22encounter_xphb%22%7D%7D%2C%7B%22x%22%3A0%2C%22y%22%3A0%2C%22w%22%3A2%2C%22h%22%3A2%2C%22t%22%3A1%2C%22c%22%3A%7B%22p%22%3A%22tables.html%22%2C%22s%22%3A%22XGE%22%2C%22u%22%3A%22forest%2520encounters%2520(levels%25201%25e2%2580%25944)_xge%22%7D%7D%2C%7B%22x%22%3A1%2C%22y%22%3A0%2C%22w%22%3A2%2C%22h%22%3A2%2C%22t%22%3A1%2C%22c%22%3A%7B%22p%22%3A%22tables.html%22%2C%22s%22%3A%22XGE%22%2C%22u%22%3A%22forest%2520encounters%2520(levels%25201%25e2%2580%25944)_xge%22%7D%7D%2C%7B%22x%22%3A0%2C%22y%22%3A0%2C%22w%22%3A1%2C%22h%22%3A1%2C%22t%22%3A4%2C%22c%22%3A%7B%22b%22%3A%22bookref-quick%22%2C%22c%22%3A0%2C%22h%22%3A%22Beyond%201st%20Level%22%7D%7D%5D%7D",
    "icon": "https://is3-ssl.mzstatic.com/image/thumb/Purple114/v4/74/b8/06/74b806d2-dde9-f59a-5307-9f4cc405dd07/source/512x512bb.jpg",
    "invert": false
  }
];
const initialGoogleLinksData = [
  {
    "name": "Gmail",
    "url": "https://mail.google.com",
    "icon": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Gmail_icon_%282020%29.svg/512px-Gmail_icon_%282020%29.svg.png",
    "invert": false
  },
  {
    "name": "Drive",
    "url": "https://drive.google.com",
    "icon": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Google_Drive_icon_%282020%29.svg/1200px-Google_Drive_icon_%282020%29.svg.png",
    "invert": false
  },
  {
    "name": "Calendar",
    "url": "https://calendar.google.com",
    "icon": "https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg",
    "invert": false
  },
  {
    "name": "Maps",
    "url": "https://maps.google.com/",
    "icon": "https://upload.wikimedia.org/wikipedia/commons/a/aa/Google_Maps_icon_%282020%29.svg",
    "invert": false
  },
  {
    "name": "Photos",
    "url": "https://photos.google.com/",
    "icon": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Google_Photos_icon_%282020%29.svg/1024px-Google_Photos_icon_%282020%29.svg.png",
    "invert": false
  },
  {
    "name": "YouTube",
    "url": "https://www.youtube.com",
    "icon": "https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png",
    "invert": false
  },
  {
    "name": "NotebookLM",
    "url": "https://notebooklm.google.com/",
    "icon": "https://cdn.worldvectorlogo.com/logos/google-notebooklm-logo-icon.svg",
    "invert": true
  },
  {
    "name": "Translate",
    "url": "https://translate.google.com",
    "icon": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Google_Translate_logo.svg/1024px-Google_Translate_logo.svg.png",
    "invert": false
  },
  {
    "name": "Keep",
    "url": "https://keep.google.com",
    "icon": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Google_Keep_2020_Logo.svg/1489px-Google_Keep_2020_Logo.svg.png",
    "invert": false
  },
  {
    "name": "Docs",
    "url": "http://docs.google.com",
    "icon": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Google_Docs_logo_%282014-2020%29.svg/1481px-Google_Docs_logo_%282014-2020%29.svg.png",
    "invert": false
  },
  {
    "name": "Sheets",
    "url": "http://sheets.google.com",
    "icon": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Google_Sheets_logo_%282014-2020%29.svg/1498px-Google_Sheets_logo_%282014-2020%29.svg.png",
    "invert": false
  },
  {
    "name": "Slides",
    "url": "http://slides.google.com",
    "icon": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Google_Slides_logo_%282014-2020%29.svg/1489px-Google_Slides_logo_%282014-2020%29.svg.png",
    "invert": false
  },
  {
    "name": "Blogger",
    "url": "https://www.blogger.com/",
    "icon": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Blogger.svg/2059px-Blogger.svg.png",
    "invert": false
  },
  {
    "name": "Play",
    "url": "https://play.google.com/",
    "icon": "https://cdn.freebiesupply.com/logos/large/2x/google-play-store-logo-svg-vector.svg",
    "invert": false
  },
  {
    "name": "Chrome Webstore",
    "url": "https://chrome.google.com/webstore",
    "icon": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Google_Chrome_Web_Store_icon_2022.svg/2356px-Google_Chrome_Web_Store_icon_2022.svg.png",
    "invert": false
  },
  {
    "name": "Meet",
    "url": "https://meet.google.com/",
    "icon": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Google_Meet_icon_%282020%29.svg/1245px-Google_Meet_icon_%282020%29.svg.png",
    "invert": false
  }
];