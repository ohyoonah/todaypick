import { useState } from "react";
import { FiEdit3 } from "react-icons/fi";
import { useAuthStore } from "@/stores/authStore";
import { getInitials } from "@/utils/profileUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfileHeader() {
  const { user } = useAuthStore();
  const nickname = user?.user_metadata?.nickname || "사용자";
  const [isEditing, setIsEditing] = useState(false);
  const [editNickname, setEditNickname] = useState(nickname);

  const handleSaveProfile = () => {
    // TODO: 프로필 업데이트 로직 구현
    console.log("프로필 저장:", editNickname);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditNickname(nickname);
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <Card className="mb-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 mb-6">
          <div className="relative">
            <Avatar className="h-24 w-24 ring-4 ring-blue-100">
              <AvatarImage src={user.user_metadata.avatar_url} />
              <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {getInitials(nickname)}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="text-center md:text-left flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    닉네임
                  </label>
                  <input
                    type="text"
                    value={editNickname}
                    onChange={(e) => setEditNickname(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="닉네임을 입력하세요"
                  />
                </div>
                <div className="flex space-x-2 justify-center md:justify-start">
                  <Button
                    onClick={handleSaveProfile}
                    size="sm"
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  >
                    저장
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    size="sm"
                    variant="outline"
                  >
                    취소
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center md:justify-start space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {nickname}
                  </h1>
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                  >
                    <FiEdit3 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-gray-600 mb-4">{user.email}</p>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
