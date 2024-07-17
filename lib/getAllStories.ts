import type { Page, Story } from "@/types/stories";
import fs from "fs";
import path from "path";
import { cleanTitle } from "./cleanTitle";

const storiesDirectory = path.join(process.cwd(), 'public/stories');

export const getAllStories = (): Story[] => {
  if (!fs.existsSync(storiesDirectory)) {
    return [];
  }

  const storyFolders = fs.readdirSync(storiesDirectory);
  const stories: Story[] = storyFolders.map((storyFolder) => {
    const storyPath = path.join(storiesDirectory, storyFolder);
    const files = fs.readdirSync(storyPath);
    const pages: Page[] = [];
    const pageMap: { [key: string]: Partial<Page> } = {};


    // biome-ignore lint/complexity/noForEach: <explanation>
    files.forEach((file) =>{
      const filePath = path.join(storyPath, file);
      const type = path.extname(file).substring(1);
      const pageNumber = file.match(/page(\d+)\./)?.[1];

      if(pageNumber){
        if(!pageMap[pageNumber]){
          pageMap[pageNumber]={}
        }
        if(type === 'txt'){
          pageMap[pageNumber].txt = fs.readFileSync(filePath , 'utf-8')
        }else if (type === 'png'){
          pageMap[pageNumber].png = `/stories/${storyFolder}/${file}`
        }
      }
    });

    // biome-ignore lint/complexity/noForEach: <explanation>
    Object.keys(pageMap).forEach(pageNumber =>{
      if(pageMap[pageNumber].txt && pageMap[pageNumber].png){
        pages.push(pageMap[pageNumber] as Page)
      }
    })

    return {
      story:cleanTitle(storyFolder),
      pages,
    }

  })

  const storiesWithPages = stories.filter(stroy => stroy.pages.map.length >0)
  return storiesWithPages
};

export const getStory = (story : string): Story |undefined =>{
  const stories =getAllStories()
  return stories.find(s=> s.story ===story)
}